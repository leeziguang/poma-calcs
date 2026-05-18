import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Checkbox, InputNumber, Button, Select } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import { configStore } from "src/store/config";
import { trainerStore } from "src/store/trainer";
import { EPairListFormFields, EMoveLevelValues } from "src/types";

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

    useEffect(() => {
      return () => configStore.reset();
    }, []);

    useEffect(() => {
      if (pairName === undefined) setSelectedKey(undefined);
    }, [pairName]);

    const handleAdd = () => {
      add({
        [EPairListFormFields.LVL]: 140,
        [EPairListFormFields.MOVE_LVL]: EMoveLevelValues.ONE
      });
      setPairNames(prev => [...prev, pairName ?? ""]);
      setPairName(undefined);
    };

    const handleSelect = (
      key: string,
      option: DefaultOptionType | DefaultOptionType[]
    ) => {
      setSelectedKey(key);
      const opt = Array.isArray(option) ? option[0] : option;
      setPairName(opt.label as string);
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
            options={trainerStore.trainerOptList || []}
            onChange={handleSelect}
            placeholder="Select a trainer"
            style={{ flex: 1 }}
            showSearch
            optionFilterProp="label"
          />
          <Button onClick={handleAdd} disabled={!selectedKey}>
            Add Pair
          </Button>
        </div>
      </div>
    );
  }
);
