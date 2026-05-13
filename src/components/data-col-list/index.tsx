import React, { useEffect, useState } from "react";
// import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { BaseStats } from "../base-stats";
import { RenameableTitle } from "../renameable-title";
import { EPairListFormFields } from "../../types";

import "./style.scss";
import { MovePower } from "../move-power";
import { DEFAULT_COL } from "./constants";
import { FieldEffect } from "../field-effects";
import { calcPairFinalDamage } from "./helpers";
import { pairStore } from "src/store/pair";
import { observer } from "mobx-react";

const PairDamageDisplay = observer(() => <Card>{calcPairFinalDamage()}</Card>);

const MoveDamageDisplay = observer(
  ({ moveColName }: { moveColName: string }) => (
    <Card className="dataColList-move-damage">
      <b>Damage</b>
      <div>{pairStore.moveDamageRec?.[moveColName]?.finalDamage || "-"}</div>
    </Card>
  )
);

export const DataColList = ({
  pairFieldName,
  title,
  onTitleChange
}: {
  pairFieldName: number;
  title?: string;
  onTitleChange?: (val: string) => void;
}) => {
  useEffect(() => {
    pairStore.init();

    return () => pairStore.init();
  }, []);

  const [columnTitles, setColumnTitles] = useState<Record<number, string>>({});
  const [editingCol, setEditingCol] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(undefined);

  const parentFieldPath = [EPairListFormFields.PAIR, pairFieldName];

  return (
    <Card className="dataColList-card">
      {title !== undefined && (
        <RenameableTitle
          isEditing={isEditingTitle}
          value={title}
          onChange={val => onTitleChange?.(val)}
          onStartEdit={() => setIsEditingTitle(true)}
          onEndEdit={() => setIsEditingTitle(false)}
          titleClassName="dataColList-title"
        />
      )}

      <PairDamageDisplay />

      <div className="dataColList-colWrapper">
        <Form.List name={[pairFieldName, EPairListFormFields.DATA_COL]}>
          {(fields, { add, remove }) => (
            <>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <div className="dataColList-addCol">
                    <Input
                      placeholder="Move Name"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onPressEnter={() => {
                        add();
                        setColumnTitles(prev => ({
                          ...prev,
                          [fields.length]: newTitle
                        }));
                        setNewTitle(undefined);
                      }}
                    />
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        const prevValues = getFieldValue([
                          ...parentFieldPath,
                          EPairListFormFields.DATA_COL
                        ])?.at(-1);

                        add(prevValues || DEFAULT_COL);
                        setColumnTitles(prev => ({
                          ...prev,
                          [fields.length]: newTitle
                        }));
                        setNewTitle(undefined);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </Form.Item>

              <div className="dataColList-body">
                {fields.map(field => (
                  <div key={field.key} className="dataColList-col">
                    <RenameableTitle
                      isEditing={editingCol === field.name}
                      value={columnTitles?.[field.name]}
                      onChange={val =>
                        setColumnTitles(prev => ({
                          ...prev,
                          [field.name]: val
                        }))
                      }
                      onStartEdit={() => setEditingCol(field.name)}
                      onEndEdit={() => setEditingCol(null)}
                    />

                    <MoveDamageDisplay moveColName={String(field.name)} />

                    <BaseStats
                      name={String(field.name)}
                      pairName={pairFieldName}
                    />
                    <MovePower
                      name={String(field.name)}
                      pairName={pairFieldName}
                    />
                    <FieldEffect
                      name={String(field.name)}
                      pairName={pairFieldName}
                    />

                    <Button
                      onClick={() => remove(field.name)}
                      // icon={<DeleteOutlined />}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Form.List>
      </div>
    </Card>
  );
};
