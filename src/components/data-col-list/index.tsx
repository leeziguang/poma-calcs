import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Select } from "antd";
import { BaseStats } from "../base-stats";
import { RenameableTitle } from "../renameable-title";
import { EPairListFormFields, EMoveLevelValues } from "../../types";
import { MOVE_LEVEL_OPTIONS } from "../action-topbar/constants";
import { MovePower } from "../move-power";
import { DEFAULT_COL } from "./constants";
import { FieldEffect } from "../field-effects";
import { usePairStore } from "src/store/pair-context";
import { MoveDamageDisplay } from "../damage-display/move";
import { TotalDamageDisplay } from "../damage-display/total";
import { DeleteOutlined } from "@ant-design/icons";
import "./style.scss";

export const DataColList = ({
  pairFieldName,
  title,
  onTitleChange
}: {
  pairFieldName: number;
  title?: string;
  onTitleChange?: (val: string) => void;
}) => {
  const pairStore = usePairStore();
  useEffect(() => {
    pairStore.init();

    return () => pairStore.init();
  }, []);

  const [columnTitles, setColumnTitles] = useState<
    Record<number, string | undefined>
  >({});
  const [editingCol, setEditingCol] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState<string | undefined>(undefined);

  const parentFieldPath = [EPairListFormFields.PAIR, pairFieldName];
  const form = Form.useFormInstance();

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

      <div className="dataColList-level-and-damage-bar">
        <Form.Item
          label="Move Level"
          name={[pairFieldName, EPairListFormFields.MOVE_LVL]}
          initialValue={EMoveLevelValues.ONE}
        >
          <Select options={MOVE_LEVEL_OPTIONS} />
        </Form.Item>

        <TotalDamageDisplay />
      </div>

      <div className="dataColList-colWrapper">
        <Form.List name={[pairFieldName, EPairListFormFields.DATA_COL]}>
          {(fields, { add, remove }) => {
            const handleAdd = () => {
              add(DEFAULT_COL);
              setColumnTitles(prev => ({
                ...prev,
                [fields.length]: newTitle
              }));
              setNewTitle(undefined);
            };

            return (
              <>
                <div className="dataColList-add-move-bar">
                  <div className="dataColList-addCol">
                    <Input
                      placeholder="Move Name"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onPressEnter={handleAdd}
                    />
                    <Button onClick={handleAdd}>Add</Button>
                  </div>
                </div>

                <div className="dataColList-body">
                  {fields.map(field => {
                    return (
                      <div key={field.key} className="dataColList-col">
                        <div className="dataColList-col-title">
                          <RenameableTitle
                            isEditing={editingCol === field.name}
                            value={columnTitles?.[field.name] as string}
                            onChange={val =>
                              setColumnTitles(prev => ({
                                ...prev,
                                [field.name]: val
                              }))
                            }
                            onStartEdit={() => setEditingCol(field.name)}
                            onEndEdit={() => setEditingCol(null)}
                          />
                          <div className="dataColList-col-title-actions">
                            <Button
                              onClick={() => {
                                const dupVal = form
                                  .getFieldValue([
                                    ...parentFieldPath,
                                    EPairListFormFields.DATA_COL
                                  ])
                                  ?.slice(field.name)[0];

                                add(dupVal || DEFAULT_COL);
                                setColumnTitles(prev => ({
                                  ...prev,
                                  [fields.length]: prev[field.name]
                                }));
                              }}
                              type="link"
                            >
                              Duplicate
                            </Button>
                            <DeleteOutlined
                              onClick={() => remove(field.name)}
                            />
                          </div>
                        </div>

                        <MoveDamageDisplay moveColName={String(field.name)} />

                        <BaseStats
                          name={String(field.name)}
                          fieldPath={[
                            EPairListFormFields.PAIR,
                            pairFieldName,
                            EPairListFormFields.DATA_COL,
                            field.name
                          ]}
                          pairFieldName={pairFieldName}
                        />

                        <MovePower
                          name={String(field.name)}
                          fieldPath={[
                            EPairListFormFields.PAIR,
                            pairFieldName,
                            EPairListFormFields.DATA_COL,
                            field.name
                          ]}
                          pairFieldName={pairFieldName}
                        />

                        <FieldEffect
                          name={String(field.name)}
                          fieldPath={[
                            EPairListFormFields.PAIR,
                            pairFieldName,
                            EPairListFormFields.DATA_COL,
                            field.name
                          ]}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            );
          }}
        </Form.List>
      </div>
    </Card>
  );
};
