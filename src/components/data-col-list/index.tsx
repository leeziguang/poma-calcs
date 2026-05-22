import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Button, Card, Form, Input, InputNumber, Select } from "antd";
import { BaseStats } from "../base-stats";
import { RenameableTitle } from "../renameable-title";
import { EPairListFormFields, EMoveLevelValues } from "../../types";
import { MOVE_LEVEL_OPTIONS } from "../global-toolbar/constants";
import { MovePower } from "../move-power";
import { DEFAULT_COL } from "./constants";
import { EBaseStatFormFields } from "src/types/data-col-list/base-stats";
import { EFieldEffectFormFields } from "src/types/data-col-list/field-effect";
import { FieldEffect } from "../field-effects";
import { usePairStore } from "src/store/pair-context";
import { configStore } from "src/store/config";
import { moveStore } from "src/store/move";
import { MoveDamageDisplay } from "../damage-display/move";
import { TotalDamageDisplay } from "../damage-display/total";
import { DeleteOutlined } from "@ant-design/icons";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import "./style.scss";
import { genAutoFillMovePower, genMoveOptions } from "./helpers";

export const DataColList = observer(
  ({
    pairFieldName,
    onTitleChange: _onTitleChange
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
    const [newTitle, setNewTitle] = useState<string | undefined>(undefined);

    const parentFieldPath = [EPairListFormFields.PAIR, pairFieldName];
    const form = Form.useFormInstance();

    const [selectedMoveId, setSelectedMoveId] = useState<string | undefined>(
      undefined
    );

    const pairs = Form.useWatch(EPairListFormFields.PAIR, form);
    const trainerId = pairs?.[pairFieldName]?.[EPairListFormFields.TRAINER_ID];
    const moves: number =
      pairs?.[pairFieldName]?.[EPairListFormFields.MOVES] ?? 1;

    const moveOptions = useMemo(() => genMoveOptions(trainerId), [
      trainerId,
      moveStore.moveMap,
      moveStore.moveNamesEn
    ]);

    const isCustomMode = configStore.isCustomMode;

    return (
      <Card className="dataColList-card">
        <div className="dataColList-level-and-damage-bar">
          <Form.Item
            label="Level"
            name={[pairFieldName, EPairListFormFields.LVL]}
            initialValue={140}
          >
            <InputNumber min={140} max={200} />
          </Form.Item>

          <Form.Item
            label="Move Level"
            name={[pairFieldName, EPairListFormFields.MOVE_LVL]}
            initialValue={EMoveLevelValues.ONE}
          >
            <Select options={MOVE_LEVEL_OPTIONS} />
          </Form.Item>

          <Form.Item
            label="Moves"
            name={[pairFieldName, EPairListFormFields.MOVES]}
            initialValue={18}
          >
            <InputNumber min={1} />
          </Form.Item>

          <TotalDamageDisplay moves={moves} />
        </div>

        <div className="dataColList-colWrapper">
          <Form.List name={[pairFieldName, EPairListFormFields.DATA_COL]}>
            {(fields, { add, remove }) => {
              const handleAdd = () => {
                const cols: typeof DEFAULT_COL[] =
                  form.getFieldValue([
                    ...parentFieldPath,
                    EPairListFormFields.DATA_COL
                  ]) ?? [];
                const lastCol = cols[cols.length - 1];
                const inheritedBaseStats = lastCol
                  ? {
                      [EBaseStatFormFields.STAT]:
                        lastCol[EBaseStatFormFields.STAT],
                      [EBaseStatFormFields.GRID]:
                        lastCol[EBaseStatFormFields.GRID],
                      [EBaseStatFormFields.STAT_BOOSTS]:
                        lastCol[EBaseStatFormFields.STAT_BOOSTS],
                      [EBaseStatFormFields.DEF_DROPS]:
                        lastCol[EBaseStatFormFields.DEF_DROPS]
                    }
                  : {};

                const inheritedFieldEffects = lastCol
                  ? {
                      [EFieldEffectFormFields.SYNC_BOOSTS]:
                        lastCol[EFieldEffectFormFields.SYNC_BOOSTS],
                      [EFieldEffectFormFields.WTZ]:
                        lastCol[EFieldEffectFormFields.WTZ],
                      [EFieldEffectFormFields.CIRCLE]:
                        lastCol[EFieldEffectFormFields.CIRCLE],
                      [EFieldEffectFormFields.REBUFF]:
                        lastCol[EFieldEffectFormFields.REBUFF],
                      [EFieldEffectFormFields.SEUN]:
                        lastCol[EFieldEffectFormFields.SEUN]
                    }
                  : {};

                if (!isCustomMode) {
                  const move = moveStore.moveMap[selectedMoveId ?? ""];

                  add({
                    ...DEFAULT_COL,
                    ...inheritedBaseStats,
                    ...inheritedFieldEffects,
                    ...genAutoFillMovePower(move),
                    [EMovePowerFormFields.MOVE_ID]: selectedMoveId
                  });

                  setColumnTitles(prev => ({
                    ...prev,
                    [fields.length]: selectedMoveId
                      ? moveStore.moveNamesEn[selectedMoveId]
                      : undefined
                  }));
                } else {
                  add({
                    ...DEFAULT_COL,
                    ...inheritedBaseStats,
                    ...inheritedFieldEffects
                  });
                  setColumnTitles(prev => ({
                    ...prev,
                    [fields.length]: newTitle
                  }));
                  setNewTitle(undefined);
                }
              };

              return (
                <>
                  <div className="dataColList-add-move-bar">
                    <div className="dataColList-addCol">
                      {isCustomMode ? (
                        <Input
                          placeholder="Move Name"
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                          onPressEnter={handleAdd}
                        />
                      ) : (
                        <Select
                          value={selectedMoveId}
                          onChange={setSelectedMoveId}
                          options={moveOptions}
                          placeholder="Select a move"
                        />
                      )}
                      <Button onClick={handleAdd}>Add</Button>
                    </div>
                  </div>

                  <div className="dataColList-body">
                    {fields.map(field => {
                      return (
                        <div key={field.key} className="dataColList-col">
                          <div className="dataColList-col-title">
                            {isCustomMode ? (
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
                            ) : (
                              <div
                                title={columnTitles?.[field.name]}
                                className="dataColList-col-title-value"
                              >
                                {columnTitles?.[field.name] || "Untitled"}
                              </div>
                            )}
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

                          <MoveDamageDisplay
                            moveColName={String(field.name)}
                            moves={moves}
                          />

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
  }
);
