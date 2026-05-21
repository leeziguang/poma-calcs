import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Checkbox, InputNumber, Select } from "antd";
import { configStore } from "src/store/config";
import { EPairListFormFields, EMoveLevelValues } from "src/types";
import { ITrainerOption, trainerStore } from "src/store/trainer";
import { monsterStore } from "src/store/monster";

interface IActionTopbarProps {
  add: (defaultValue?: Record<string, unknown>) => void;
  onAdd: (name: string) => void;
}

export const ActionTopbar = observer(({ add, onAdd }: IActionTopbarProps) => {
  useEffect(() => {
    return () => configStore.reset();
  }, []);

  const handleSelect = (
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
    <div className="pairList-actions-row-wrapper">
      <div className="pairList-actions-row-wrapper-delete-wrapper">
        Enemy Def
        <InputNumber
          value={configStore.enemyDef}
          onChange={val => val !== null && configStore.setEnemyDef(val)}
          placeholder="Enemy Def"
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
      <div className="pairList-actions-row-wrapper-add-wrapper">
        <Select
          options={trainerStore.trainerOptionsList || []}
          onChange={handleSelect}
          placeholder="Select a trainer"
          showSearch
        />
      </div>
    </div>
  );
});
