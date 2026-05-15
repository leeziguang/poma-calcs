import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Collapse, Form, InputNumber, Select } from "antd";
import { statBoostOptions, statDropOptions } from "./constants";
import { EBaseStatFormFields } from "src/types/base-stats";
import { calcBaseStat } from "./helpers";
import { pairStore } from "src/store/pair";
import "./style.scss";
import { EPairListFormFields } from "src/types";

interface IBaseStatsProps {
  name: string;
  fieldPath: (string | number)[];
  pairFieldName: number;
}

export const BaseStats = observer(
  ({ name, fieldPath, pairFieldName }: IBaseStatsProps) => {
    const form = Form.useFormInstance();
    const stat = Form.useWatch([...fieldPath, EBaseStatFormFields.STAT], form);
    const moveLvl = Form.useWatch(
      [EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MOVE_LVL],
      form
    );
    const grid = Form.useWatch([...fieldPath, EBaseStatFormFields.GRID], form);
    const statBoost = Form.useWatch(
      [...fieldPath, EBaseStatFormFields.STAT_BOOSTS],
      form
    );
    const defDrops = Form.useWatch(
      [...fieldPath, EBaseStatFormFields.DEF_DROPS],
      form
    );

    const headerVal = calcBaseStat({
      stat,
      grid,
      statBoost,
      defDrops,
      moveLvl
    });

    useEffect(() => {
      pairStore.updateMoveInfo(name, { baseStat: headerVal });
    }, [name, headerVal]);

    return (
      <Collapse
        className="baseStats-collapse"
        defaultActiveKey={["base-stats-panel"]}
      >
        <Collapse.Panel
          key="base-stats-panel"
          header={
            <>
              <div>Base Stat</div>
              {headerVal?.toLocaleString(undefined, {
                maximumFractionDigits: 6
              })}
            </>
          }
        >
          <Form.Item name={[name, EBaseStatFormFields.STAT]} label="Raw Stat">
            <InputNumber min={0} autoFocus />
          </Form.Item>

          <Form.Item name={[name, EBaseStatFormFields.GRID]} label="Grid Boost">
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name={[name, EBaseStatFormFields.STAT_BOOSTS]}
            label="Stat Boost"
          >
            <Select options={statBoostOptions} />
          </Form.Item>

          <Form.Item
            name={[name, EBaseStatFormFields.DEF_DROPS]}
            label="Def Drops"
          >
            <Select options={statDropOptions} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    );
  }
);
