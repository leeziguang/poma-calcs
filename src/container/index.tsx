import React, { useRef, useState } from "react";
import { observer } from "mobx-react";
import { DataColList } from "../components/data-col-list";
import { Form, Tabs } from "antd";
import { EPairListFormFields } from "src/types";
import { ActionTopbar } from "src/components/action-topbar";
import { PairStore } from "src/store/pair";
import { PairStoreContext } from "src/store/pair-context";
import { getPercent } from "src/lib/helpers";
import { RenameableTitle } from "src/components/renameable-title";
import "./style.scss";

const TabLabel = observer(
  ({
    name,
    store,
    firstStore,
    onRename
  }: {
    name: string;
    store: PairStore;
    firstStore: PairStore | undefined;
    onRename: (val: string) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const percent = firstStore
      ? getPercent(store.totalDamage, firstStore.totalDamage)
      : " - %";

    return (
      <span className="tabLabel" onKeyDown={e => e.stopPropagation()}>
        <RenameableTitle
          isEditing={isEditing}
          value={name}
          onChange={onRename}
          onStartEdit={() => setIsEditing(true)}
          onEndEdit={() => setIsEditing(false)}
        />
        <span className="tabLabel-percent">({percent})</span>
      </span>
    );
  }
);

const PokemonList = () => {
  const [form] = Form.useForm();
  const [pairName, setPairName] = useState<string | undefined>(undefined);
  const [pairNames, setPairNames] = useState<string[]>([]);
  const storesRef = useRef<Map<React.Key, PairStore>>(new Map());

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

  return (
    <Form colon={false} layout="vertical" className="form" form={form}>
      <Form.List name={EPairListFormFields.PAIR}>
        {(fields, { add, remove }) => {
          const firstStore =
            fields.length > 0 ? getOrCreateStore(fields[0].key) : undefined;

          return (
            <>
              <ActionTopbar
                add={add}
                pairName={pairName}
                setPairName={setPairName}
                setPairNames={setPairNames}
              />

              <Tabs
                type="editable-card"
                hideAdd
                onEdit={(targetKey, action) => {
                  if (action !== "remove") return;
                  const field = fields.find(
                    f => String(f.key) === String(targetKey)
                  );
                  if (!field) return;
                  storesRef.current.delete(field.key);
                  remove(field.name);
                  setPairNames(prev => prev.filter((_, i) => i !== field.name));
                }}
                items={fields.map(field => {
                  const store = getOrCreateStore(field.key);
                  const name =
                    pairNames[field.name] ?? `Pair ${field.name + 1}`;

                  return {
                    key: String(field.key),
                    label: (
                      <TabLabel
                        name={name}
                        store={store}
                        firstStore={firstStore}
                        onRename={val => handleRename(field.name, val)}
                      />
                    ),
                    children: (
                      <PairStoreContext.Provider value={store}>
                        <DataColList
                          pairFieldName={field.name}
                          title={
                            pairNames[field.name] ?? `Pair ${field.name + 1}`
                          }
                          onTitleChange={val => handleRename(field.name, val)}
                        />
                      </PairStoreContext.Provider>
                    )
                  };
                })}
              />
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

export const MainPage = () => {
  return (
    <div>
      <b>Poma Calcs</b>
      <PokemonList />
    </div>
  );
};
