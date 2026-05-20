import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Checkbox, InputNumber, Button, Select } from "antd";
import { configStore } from "src/store/config";
import { EPairListFormFields, EMoveLevelValues } from "src/types";
import { ITrainerOption, trainerStore } from "src/store/trainer";
import { monsterStore } from "src/store/monster";

interface IActionTopbarProps {
  add: (defaultValue?: Record<string, unknown>) => void;
  setPairName: (name: string | undefined) => void;
  pairName: string | undefined;
  setPairNames: (updater: (prev: string[]) => string[]) => void;
}

export const ActionTopbar = observer(
  ({ add, setPairName, pairName, setPairNames }: IActionTopbarProps) => {
    const [selectedKey, setSelectedKey] = useState<string | undefined>(
      undefined
    );
    const [selectedOption, setSelectedOption] = useState<
      ITrainerOption | undefined
    >(undefined);

    useEffect(() => {
      return () => configStore.reset();
    }, []);

    useEffect(() => {
      if (pairName === undefined) {
        setSelectedKey(undefined);
        setSelectedOption(undefined);
      }
    }, [pairName]);

    const handleAdd = () => {
      monsterStore.setSelectedMonsterBaseId(selectedOption?.monsterId ?? "");
      trainerStore.setSelectedTrainerId(selectedOption?.trainerId ?? "");

      add({
        [EPairListFormFields.LVL]: 140,
        [EPairListFormFields.MOVE_LVL]: EMoveLevelValues.ONE,
        [EPairListFormFields.MONSTER_ID]: selectedOption?.monsterId,
        [EPairListFormFields.TRAINER_ID]: selectedOption?.trainerId
      });
      setPairNames(prev => [...prev, pairName ?? ""]);
      setPairName(undefined);
    };

    const handleSelect = (
      key: string,
      option: ITrainerOption | ITrainerOption[]
    ) => {
      setSelectedKey(key);

      const opt = Array.isArray(option) ? option[0] : option;
      setPairName(opt.label as string);
      setSelectedOption(opt as ITrainerOption);
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
            value={selectedKey}
            options={trainerStore.trainerOptionsList || []}
            onChange={handleSelect}
            placeholder="Select a trainer"
            showSearch
          />
          <Button onClick={handleAdd} disabled={!selectedKey}>
            Add Pair
          </Button>
        </div>
      </div>
    );
  }
);
