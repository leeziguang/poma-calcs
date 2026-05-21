import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import { DataColList } from "../components/data-col-list";
import { Form, Spin, Tabs, Tooltip } from "antd";
import {
  EPairListFormFields,
  FormListFields,
  FormListOperations
} from "src/types";
import { ActionTopbar } from "src/components/action-topbar";
import { PairStore } from "src/store/pair";
import { PairStoreContext } from "src/store/pair-context";
import { formatMoveLevel, getPercent } from "src/lib/helpers";
import { RenameableTitle } from "src/components/renameable-title";
import { genTrainerOptionList } from "./helpers";

import { configStore } from "src/store/config";
import { trainerStore } from "src/store/trainer";
import { monsterStore } from "src/store/monster";
import { moveStore } from "src/store/move";
import { passiveStore } from "src/store/passive";

import "./style.scss";

const TabLabel = observer(
  ({
    name,
    fieldName,
    store,
    firstStore,
    onRename
  }: {
    name: string;
    fieldName: number;
    store: PairStore;
    firstStore: PairStore | undefined;
    onRename: (val: string) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = Form.useFormInstance();
    const pairs = Form.useWatch(EPairListFormFields.PAIR, form);
    const level = pairs?.[fieldName]?.[EPairListFormFields.LVL];
    const moveLevel = pairs?.[fieldName]?.[EPairListFormFields.MOVE_LVL];
    const percent = firstStore
      ? getPercent(store.totalDamage, firstStore.totalDamage)
      : " - %";

    return (
      <span className="tabLabel" onKeyDown={e => e.stopPropagation()}>
        <div>
          {configStore.isCustomMode ? (
            <RenameableTitle
              isEditing={isEditing}
              value={name}
              onChange={onRename}
              onStartEdit={() => setIsEditing(true)}
              onEndEdit={() => setIsEditing(false)}
              displaySuffix={
                <>
                  {level !== undefined && moveLevel !== undefined && (
                    <span className="tabLabel-title-levels">
                      {` (${level}) ${formatMoveLevel(moveLevel)} EXR`}
                    </span>
                  )}
                  <span className="tabLabel-percent">[{percent}]</span>
                </>
              }
            />
          ) : (
            <Tooltip
              title={`${name} (${level}) ${formatMoveLevel(moveLevel)} EXR`}
            >
              <div className="tabLabel-title">
                <div className="tabLabel-title-name">{name || "Untitled"}</div>
                {level !== undefined && moveLevel !== undefined && (
                  <span className="tabLabel-title-levels">
                    {` (${level}) ${formatMoveLevel(moveLevel)} EXR`}
                  </span>
                )}
                <span className="tabLabel-percent">[{percent}]</span>
              </div>
            </Tooltip>
          )}
        </div>
      </span>
    );
  }
);

const PairListBody = ({
  fields,
  add,
  remove
}: {
  fields: FormListFields;
  add: FormListOperations["add"];
  remove: FormListOperations["remove"];
}) => {
  const [pairNames, setPairNames] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const storesRef = useRef<Map<React.Key, PairStore>>(new Map());
  const prevLengthRef = useRef(fields.length);

  useEffect(() => {
    if (fields.length > prevLengthRef.current && fields.length > 0) {
      setActiveKey(String(fields[fields.length - 1].key));
    }
    prevLengthRef.current = fields.length;
  }, [fields.length]);

  const getOrCreateStore = (key: React.Key): PairStore => {
    if (!storesRef.current.has(key)) {
      const store = new PairStore();
      store.init();
      storesRef.current.set(key, store);
    }
    return storesRef.current.get(key) as PairStore;
  };

  const handleRename = (fieldName: number, val: string) =>
    setPairNames(prev => prev.map((n, i) => (i === fieldName ? val : n)));

  const firstStore =
    fields.length > 0 ? getOrCreateStore(fields[0].key) : undefined;

  return (
    <>
      <ActionTopbar
        add={add}
        onAdd={name => setPairNames(prev => [...prev, name])}
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

const PokemonList = () => {
  const [form] = Form.useForm();

  return (
    <Form colon={false} layout="vertical" className="form" form={form}>
      <Form.List name={EPairListFormFields.PAIR}>
        {(fields, { add, remove }) => (
          <PairListBody fields={fields} add={add} remove={remove} />
        )}
      </Form.List>
    </Form>
  );
};

export const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      trainerStore.initApiCalls(),
      monsterStore.initApiCalls(),
      moveStore.initApiCalls(),
      passiveStore.initApiCalls()
    ])
      .then(() => {
        //
        // this is here to ensure load lag from opening trainer select is shifted to page init load instead
        runInAction(() => genTrainerOptionList());
      })
      .finally(() => setIsLoading(false));

    return () => {
      trainerStore.reset();
      monsterStore.reset();
      moveStore.reset();
      passiveStore.reset();
    };
  }, []);

  return (
    <div>
      <b>Poma Calcs</b>
      <Spin spinning={isLoading}>
        <PokemonList />
      </Spin>
    </div>
  );
};
