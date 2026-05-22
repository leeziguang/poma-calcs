import React, { useEffect, useRef, useState } from "react";
import { Form, Tabs } from "antd";
import { FormListFields, FormListOperations } from "src/types";
import { DataColList } from "src/components/data-col-list";
import { PairStoreContext } from "src/store/pair-context";
import { GlobalToolbar } from "src/components/global-toolbar";
import { usePairSession } from "src/components/global-toolbar/helpers";
import { TabLabel } from "src/components/tab-label";
import { useStoreMap } from "./useStoreMap";
import { ISavedSession } from "src/types/session";

import "./style.scss";

export const PairListBody = ({
  fields,
  add,
  remove,
  autoSaveFnRef,
  pendingSession
}: {
  fields: FormListFields;
  add: FormListOperations["add"];
  remove: FormListOperations["remove"];
  autoSaveFnRef: React.MutableRefObject<(() => void) | null>;
  pendingSession: ISavedSession | null;
}) => {
  const [pairNames, setPairNames] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const prevLengthRef = useRef(fields.length);
  const form = Form.useFormInstance();

  const pairNamesRef = useRef(pairNames);
  const activeKeyRef = useRef(activeKey);
  const fieldsRef = useRef(fields);
  useEffect(() => {
    pairNamesRef.current = pairNames;
  }, [pairNames]);
  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);
  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  useEffect(() => {
    if (fields.length > prevLengthRef.current && fields.length > 0) {
      setActiveKey(String(fields[fields.length - 1].key));
    }
    prevLengthRef.current = fields.length;
  }, [fields.length]);

  const { storesRef, getOrCreateStore } = useStoreMap();

  const handleRename = (fieldName: number, val: string) =>
    setPairNames(prev => prev.map((n, i) => (i === fieldName ? val : n)));

  const {
    debouncedAutoSave,
    handleSaveSession,
    handleLoadSession,
    handleDeleteSession,
    handleExportJson,
    handleImportJson,
    handleExportTsv
  } = usePairSession({
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
  });

  autoSaveFnRef.current = debouncedAutoSave;

  const firstStore =
    fields.length > 0 ? getOrCreateStore(fields[0].key) : undefined;

  return (
    <>
      <GlobalToolbar
        onSave={handleSaveSession}
        onLoad={handleLoadSession}
        onDelete={handleDeleteSession}
        onExportJson={handleExportJson}
        onExportTsv={handleExportTsv}
        onImport={handleImportJson}
        add={add}
        onAdd={name => {
          setPairNames(prev => [...prev, name]);
          setTimeout(debouncedAutoSave, 0);
        }}
      />

      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={(targetKey, action) => {
          if (action !== "remove") return;
          const field = fields.find(f => String(f.key) === String(targetKey));
          if (!field) return;
          storesRef.current.delete(field.key);
          remove(field.name);
          setPairNames(prev => prev.filter((_, i) => i !== field.name));
          setTimeout(debouncedAutoSave, 0);
        }}
        items={fields.map(field => {
          const store = getOrCreateStore(field.key);
          const name = pairNames[field.name] ?? `Pair ${field.name + 1}`;

          return {
            key: String(field.key),
            label: (
              <TabLabel
                name={name}
                fieldName={field.name}
                store={store}
                firstStore={firstStore}
                onRename={val => handleRename(field.name, val)}
              />
            ),
            children: (
              <PairStoreContext.Provider value={store}>
                <DataColList
                  pairFieldName={field.name}
                  onTitleChange={val => handleRename(field.name, val)}
                />
              </PairStoreContext.Provider>
            )
          };
        })}
      />
    </>
  );
};
