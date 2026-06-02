import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Tooltip
} from "antd";
import { sessionStore } from "src/store/session";
import { configStore } from "src/store/config";
import {
  EPairListFormFields,
  EMoveLevelValues,
  FormListOperations
} from "src/types";
import { ITrainerOption, trainerStore } from "src/store/trainer";
import { monsterStore } from "src/store/monster";

import "./style.scss";

interface IGlobalToolbarProps {
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
  onExportJson: () => void;
  onExportTsv: () => void;
  onImport: (file: File, onName: (name: string) => void) => void;
  add: FormListOperations["add"];
  onAdd: (name: string) => void;
}

export const GlobalToolbar = observer(
  ({
    onSave,
    onLoad,
    onDelete,
    onExportJson,
    onExportTsv,
    onImport,
    add,
    onAdd
  }: IGlobalToolbarProps) => {
    const [saveInput, setSaveInput] = useState(
      sessionStore.activeSessionName ?? ""
    );
    const [saveError, setSaveError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sessionNames = Object.keys(sessionStore.namedSessions);
    const activeSession = sessionStore.activeSessionName;

    useEffect(() => {
      return () => configStore.reset();
    }, []);

    const handleSave = () => {
      const name = saveInput.trim();
      if (!name) {
        setSaveError("Session name cannot be empty");
        return;
      }
      setSaveError("");
      onSave(name);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImport(file, setSaveInput);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleTrainerSelect = (
      _key: string,
      option: ITrainerOption | ITrainerOption[]
    ) => {
      const opt = Array.isArray(option) ? option[0] : option;
      monsterStore.setSelectedMonsterBaseId(opt?.monsterId ?? "");
      trainerStore.setSelectedTrainerId(opt?.trainerId ?? "");
      add({
        [EPairListFormFields.LVL]: 140,
        [EPairListFormFields.MOVE_LVL]: EMoveLevelValues.ONE,
        [EPairListFormFields.MONSTER_ID]: opt?.monsterId,
        [EPairListFormFields.TRAINER_ID]: opt?.trainerId
      });
      onAdd(opt?.label ?? "");
    };

    return (
      <Collapse
        className="globalToolbar-collapse"
        defaultActiveKey={["toolbar"]}
      >
        <Collapse.Panel header={<b>Actions</b>} key="toolbar">
          <div className="globalToolbar">
            <div className="globalToolbar-section">
              <Select
                className="globalToolbar-trainerSelect"
                options={trainerStore.trainerOptionsList || []}
                onChange={handleTrainerSelect}
                placeholder="Select a trainer"
                showSearch
              />
            </div>

            <div className="globalToolbar-section">
              <div className="globalToolbar-saveRow">
                <Tooltip title={saveError || undefined}>
                  <Input
                    className="globalToolbar-nameInput"
                    placeholder="Session name"
                    value={saveInput}
                    onChange={e => {
                      setSaveInput(e.target.value);
                      if (saveError) setSaveError("");
                    }}
                    onPressEnter={handleSave}
                    status={saveError ? "error" : undefined}
                  />
                </Tooltip>
                <Button danger onClick={handleSave}>
                  Save
                </Button>
              </div>
              <Select
                className="globalToolbar-loadSelect"
                placeholder="Load session…"
                value={activeSession ?? undefined}
                options={sessionNames.map(n => ({ label: n, value: n }))}
                onChange={name => {
                  onLoad(name);
                  setSaveInput(name);
                }}
                allowClear
              />
              {activeSession && (
                <Popconfirm
                  title="Delete this session?"
                  onConfirm={() => onDelete(activeSession)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              )}
            </div>

            <div className="globalToolbar-section globalToolbar-exportRow">
              <Button size="small" onClick={onExportJson}>
                Export JSON
              </Button>
              <Button size="small" onClick={onExportTsv}>
                Export TSV
              </Button>
              <Button
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <div className="globalToolbar-section">
              <span className="globalToolbar-label">Enemy Def</span>
              <InputNumber
                className="globalToolbar-enemyDef"
                value={configStore.enemyDef}
                onChange={val => val !== null && configStore.setEnemyDef(val)}
                placeholder="Def"
                controls={false}
                min={0}
              />
              <Checkbox
                checked={configStore.isCustomMode}
                onChange={e => configStore.setIsCustomMode(e.target.checked)}
              >
                Custom Mode
              </Checkbox>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  }
);
