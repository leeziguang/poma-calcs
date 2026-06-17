import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { observer } from "mobx-react";
import { Button, Card, Form, Input, InputNumber, Select } from "antd";
import { BaseStats } from "../base-stats";
import { RenameableTitle } from "../renameable-title";
import { EPairListFormFields, EMoveLevelValues } from "../../types";
import { MOVE_LEVEL_OPTIONS } from "../global-toolbar/constants";
import { MovePower } from "../move-power";
import { DEFAULT_COL } from "./constants";
import { FieldEffect } from "../field-effects";
import { usePairStore } from "src/store/pair-context";
import { configStore } from "src/store/config";
import { moveStore } from "src/store/move";
import { MoveDamageDisplay } from "../damage-display/move";
import { TotalDamageDisplay } from "../damage-display/total";
import { DeleteOutlined } from "@ant-design/icons";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import {
  genAutoFillMovePower,
  genMoveOptions,
  inheritBaseStats,
  inheritFieldEffects
} from "./helpers";
import { PassiveGridSider } from "../passive-grid-sider";
import { passiveStore } from "src/store/passive";
import "./style.scss";

interface IDataColItemProps {
  fieldKey: number;
  fieldName: number;
  pairFieldName: number;
  isCustomMode: boolean;
  isEditing: boolean;
  colTitle: string | undefined;
  onTitleChange: (fieldName: number, val: string) => void;
  onStartEdit: (fieldName: number) => void;
  onEndEdit: () => void;
  onDuplicate: (fieldName: number) => void;
  onRemove: (fieldName: number) => void;
}

const DataColItem = React.memo(
  ({
    fieldKey,
    fieldName,
    pairFieldName,
    isCustomMode,
    isEditing,
    colTitle,
    onTitleChange,
    onStartEdit,
    onEndEdit,
    onDuplicate,
    onRemove
  }: IDataColItemProps) => {
    const name = String(fieldName);
    return (
      <div key={fieldKey} className="dataColList-col">
        <div className="dataColList-col-title">
          {isCustomMode ? (
            <RenameableTitle
              isEditing={isEditing}
              value={colTitle as string}
              onChange={val => onTitleChange(fieldName, val)}
              onStartEdit={() => onStartEdit(fieldName)}
              onEndEdit={onEndEdit}
            />
          ) : (
            <div title={colTitle} className="dataColList-col-title-value">
              {colTitle || "Untitled"}
            </div>
          )}
          <div className="dataColList-col-title-actions">
            <Button onClick={() => onDuplicate(fieldName)} type="link">
              Duplicate
            </Button>
            <DeleteOutlined onClick={() => onRemove(fieldName)} />
          </div>
        </div>

        <MoveDamageDisplay moveColName={name} />

        <BaseStats
          name={name}
          fieldPath={[
            EPairListFormFields.PAIR,
            pairFieldName,
            EPairListFormFields.DATA_COL,
            fieldName
          ]}
          pairFieldName={pairFieldName}
        />

        <MovePower name={name} pairFieldName={pairFieldName} />

        <FieldEffect name={name} pairFieldName={pairFieldName} />
      </div>
    );
  }
);

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

      return () => {
        pairStore.init();
        passiveStore.clearPairPassiveState(pairFieldName);
      };
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
    const trainerId = Form.useWatch(
      [EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.TRAINER_ID],
      form
    );

    // Refs so stable callbacks can always access the latest add/remove/fieldsLength
    const addRef = useRef<((defaultValue?: unknown) => void) | null>(null);
    const removeRef = useRef<((index: number) => void) | null>(null);
    const fieldsLengthRef = useRef<number>(0);

    const getColTitle = useCallback(
      (fieldName: number): string | undefined => {
        if (columnTitles[fieldName] !== undefined)
          return columnTitles[fieldName];
        const col = form.getFieldValue([
          EPairListFormFields.PAIR,
          pairFieldName,
          EPairListFormFields.DATA_COL,
          fieldName
        ]) as Record<string, unknown> | undefined;
        const moveName = col?.MOVE_NAME as string | undefined;
        if (moveName) return moveName;
        const moveId = col?.MOVE_ID;
        return moveId ? moveStore.moveNamesEn[String(moveId)] : undefined;
      },
      [columnTitles, form, pairFieldName]
    );

    const handleTitleChange = useCallback((fieldName: number, val: string) => {
      setColumnTitles(prev => ({ ...prev, [fieldName]: val }));
    }, []);

    const handleStartEdit = useCallback((fieldName: number) => {
      setEditingCol(fieldName);
    }, []);

    const handleEndEdit = useCallback(() => {
      setEditingCol(null);
    }, []);

    const handleDuplicate = useCallback(
      (fieldName: number) => {
        const dupVal = form.getFieldValue([
          ...parentFieldPath,
          EPairListFormFields.DATA_COL
        ])?.[fieldName];
        addRef.current?.(dupVal || DEFAULT_COL);
        setColumnTitles(prev => ({
          ...prev,
          [fieldsLengthRef.current]: getColTitle(fieldName)
        }));
      },
      [form, parentFieldPath, getColTitle]
    );

    const handleRemove = useCallback((fieldName: number) => {
      removeRef.current?.(fieldName);
    }, []);

    const moveOptions = useMemo(() => genMoveOptions(trainerId), [
      trainerId,
      moveStore.moveMap,
      moveStore.moveNamesEn
    ]);

    const isCustomMode = configStore.isCustomMode;

    return (
      <Card className="dataColList-card">
        <div className="dataColList-bar-col-wrapper">
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

            <TotalDamageDisplay pairFieldName={pairFieldName} />
          </div>

          <div className="dataColList-colWrapper">
            <Form.List name={[pairFieldName, EPairListFormFields.DATA_COL]}>
              {(fields, { add, remove }) => {
                addRef.current = add;
                removeRef.current = remove;
                fieldsLengthRef.current = fields.length;

                const handleAdd = () => {
                  const cols: typeof DEFAULT_COL[] =
                    form.getFieldValue([
                      ...parentFieldPath,
                      EPairListFormFields.DATA_COL
                    ]) ?? [];
                  const lastCol = cols[cols.length - 1];
                  const inheritedBaseStats = lastCol
                    ? inheritBaseStats(lastCol)
                    : {};
                  const inheritedFieldEffects = lastCol
                    ? inheritFieldEffects(lastCol)
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
                      {fields.map(field => (
                        <DataColItem
                          key={field.key}
                          fieldKey={field.key}
                          fieldName={field.name}
                          pairFieldName={pairFieldName}
                          isCustomMode={isCustomMode}
                          isEditing={editingCol === field.name}
                          colTitle={
                            columnTitles[field.name] ?? getColTitle(field.name)
                          }
                          onTitleChange={handleTitleChange}
                          onStartEdit={handleStartEdit}
                          onEndEdit={handleEndEdit}
                          onDuplicate={handleDuplicate}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </>
                );
              }}
            </Form.List>
          </div>
        </div>
        <PassiveGridSider pairFieldName={pairFieldName} trainerId={trainerId} />
      </Card>
    );
  }
);
