import React, { useCallback, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { autorun } from "mobx";
import { Modal, notification } from "antd";
import { FormInstance } from "antd/lib/form";
import debounce from "lodash/debounce";
import { EPairListFormFields, FormListFields } from "src/types";
import { PairStore } from "src/store/pair";
import { IMoveInfo } from "src/types/pair";
import { configStore } from "src/store/config";
import { monsterStore } from "src/store/monster";
import { trainerStore } from "src/store/trainer";
import { moveStore } from "src/store/move";
import { sessionStore } from "src/store/session";
import { ISavedSession } from "src/types/session";
import { buildTsvRows, triggerDownload } from "src/lib/export";

interface IPairSessionDeps {
  form: FormInstance;
  fields: FormListFields;
  fieldsRef: React.MutableRefObject<FormListFields>;
  pairNamesRef: React.MutableRefObject<string[]>;
  activeKeyRef: React.MutableRefObject<string | undefined>;
  storesRef: React.MutableRefObject<Map<React.Key, PairStore>>;
  getOrCreateStore: (key: React.Key) => PairStore;
  setPairNames: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  pendingSession: ISavedSession | null;
}

export function usePairSession({
  form,
  fields,
  fieldsRef,
  pairNamesRef,
  activeKeyRef,
  storesRef,
  getOrCreateStore,
  setPairNames,
  setActiveKey,
  pendingSession
}: IPairSessionDeps) {
  const pendingRestoreRef = useRef<ISavedSession | null>(null);

  const buildSnapshot = useCallback(
    (name = ""): ISavedSession => {
      const currentFields = fieldsRef.current;
      const pairStores: Record<string, Record<string, unknown>> = {};
      currentFields.forEach((field, i) => {
        const store = storesRef.current.get(field.key);
        pairStores[String(i)] = store?.serialize() ?? {};
      });
      const currentActiveKey = activeKeyRef.current;
      const activeIdx = currentFields.findIndex(
        f => String(f.key) === currentActiveKey
      );
      return {
        version: 1,
        name,
        savedAt: moment().toISOString(),
        config: configStore.serialize(),
        formValues: (() => {
          const raw = form.getFieldsValue();
          return {
            ...raw,
            PAIR: (raw.PAIR ?? []).map((pair: Record<string, unknown>) => ({
              ...pair,
              DATA_COL: (
                (pair.DATA_COL as Record<string, unknown>[]) ?? []
              ).map(col => ({
                ...col,
                MOVE_NAME:
                  moveStore.moveNamesEn[String(col.MOVE_ID)] ?? undefined
              }))
            }))
          };
        })(),
        pairNames: [...pairNamesRef.current],
        activeKey: activeIdx >= 0 ? String(activeIdx) : undefined,
        pairStores: pairStores as Record<string, Record<string, IMoveInfo>>
      };
    },
    [form, fieldsRef, storesRef, activeKeyRef, pairNamesRef]
  );

  const debouncedAutoSave = useMemo(
    () =>
      debounce(() => {
        sessionStore.writeAutoSave(buildSnapshot());
      }, 500),
    [buildSnapshot]
  );

  useEffect(() => {
    const dispose = autorun(() => {
      void configStore.enemyDef;
      void configStore.isCustomMode;
      debouncedAutoSave();
    });
    return () => {
      dispose();
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  // Apply store hydrations once fields count matches the expected restore count
  useEffect(() => {
    const pending = pendingRestoreRef.current;
    if (!pending) return;
    const expectedCount = Math.max(pending.pairNames.length, 1);
    if (fields.length !== expectedCount) return;

    Object.entries(pending.pairStores).forEach(([indexStr, storeData]) => {
      const i = parseInt(indexStr, 10);
      const field = fields[i];
      if (field) {
        getOrCreateStore(field.key).hydrate(storeData);
      }
    });

    if (pending.activeKey !== undefined) {
      const idx = parseInt(pending.activeKey, 10);
      const targetField = fields[idx] ?? fields[0];
      if (targetField) setActiveKey(String(targetField.key));
    } else if (fields.length > 0) {
      setActiveKey(String(fields[0].key));
    }

    pendingRestoreRef.current = null;
  }, [fields, getOrCreateStore, setActiveKey]);

  const applySessionState = useCallback(
    (saved: ISavedSession) => {
      if (saved.pairNames.length === 0) return;

      const savedPairs = (saved.formValues as Record<string, unknown>)?.PAIR as
        | Array<Record<string, string>>
        | undefined;
      const lastPair = savedPairs?.[savedPairs.length - 1];
      if (lastPair?.[EPairListFormFields.MONSTER_ID]) {
        monsterStore.setSelectedMonsterBaseId(
          String(lastPair[EPairListFormFields.MONSTER_ID])
        );
      }
      if (lastPair?.[EPairListFormFields.TRAINER_ID]) {
        trainerStore.setSelectedTrainerId(
          String(lastPair[EPairListFormFields.TRAINER_ID])
        );
      }

      form.setFieldsValue(saved.formValues);
      setPairNames(saved.pairNames);
      configStore.hydrate(saved.config);
      pendingRestoreRef.current = saved;
    },
    [form, setPairNames]
  );

  useEffect(() => {
    if (!pendingSession) return;
    applySessionState(pendingSession);
  }, [pendingSession, applySessionState]);

  const handleSaveSession = useCallback(
    (name: string) => {
      sessionStore.saveSession(name, buildSnapshot(name));
      sessionStore.setActiveSessionName(name);
    },
    [buildSnapshot]
  );

  const handleLoadSession = useCallback(
    (name: string) => {
      const saved = sessionStore.namedSessions[name];
      if (!saved) return;
      Modal.confirm({
        title: "Load session?",
        content: "Unsaved changes will be lost.",
        onOk: () => {
          applySessionState(saved);
          sessionStore.setActiveSessionName(name);
        }
      });
    },
    [applySessionState]
  );

  const handleDeleteSession = useCallback((name: string) => {
    sessionStore.deleteSession(name);
    if (sessionStore.activeSessionName === name) {
      sessionStore.setActiveSessionName(undefined);
    }
  }, []);

  const handleExportJson = useCallback(() => {
    const snapshot = buildSnapshot(sessionStore.activeSessionName ?? "export");
    triggerDownload(
      JSON.stringify(snapshot, null, 2),
      `poma-calcs-${moment().format("DDMMMYYYY-HHmm")}.json`,
      "application/json"
    );
  }, [buildSnapshot]);

  const handleImportJson = useCallback(
    (file: File, onName: (name: string) => void) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const parsed = JSON.parse(
            e.target?.result as string
          ) as ISavedSession;
          if (parsed.version !== 1) throw new Error("unsupported version");
          Modal.confirm({
            title: "Import will replace current session. Continue?",
            onOk: () => {
              applySessionState(parsed);
              onName(parsed.name);
              notification.success({ message: "Session imported" });
            }
          });
        } catch {
          notification.error({
            message: "Invalid session file — could not import"
          });
        }
      };
      reader.readAsText(file);
    },
    [applySessionState]
  );

  const handleExportTsv = useCallback(() => {
    const rows = buildTsvRows(
      fieldsRef.current,
      pairNamesRef.current,
      storesRef.current,
      form.getFieldsValue() as Record<string, unknown>
    );
    triggerDownload(
      rows.map(row => row.join("\t")).join("\n"),
      `poma-calcs-${moment().format("DDMMMYY")}.tsv`,
      "text/tab-separated-values"
    );
  }, [form, fieldsRef, pairNamesRef, storesRef]);

  return {
    buildSnapshot,
    debouncedAutoSave,
    handleSaveSession,
    handleLoadSession,
    handleDeleteSession,
    handleExportJson,
    handleImportJson,
    handleExportTsv
  };
}
