import React, { useEffect, useMemo } from "react";
import { Collapse, Form, InputNumber, Select } from "antd";
import { statBoostOptions, statDropOptions } from "./constants";
import { EPairListFormFields } from "../../types";
import { EBaseStatFormFields } from "src/types/base-stats";
import { calcBaseStat } from "./helpers";
import "./style.scss";
import { pairStore } from "src/store/pair";

interface IBaseStatsProps {
  name: string;
  pairName: number;
}

export const BaseStats = ({ name, pairName }: IBaseStatsProps) => {
  const colValue = Form.useWatch([
    EPairListFormFields.PAIR,
    pairName,
    EPairListFormFields.DATA_COL,
    name
  ]);

  const headerVal = useMemo(
    () =>
      calcBaseStat({
        stat: colValue?.[EBaseStatFormFields.STAT],
        grid: colValue?.[EBaseStatFormFields.GRID],
        statBoost: colValue?.[EBaseStatFormFields.STAT_BOOSTS],
        defDrops: colValue?.[EBaseStatFormFields.DEF_DROPS]
      }),
    [colValue]
  );

  useEffect(() => {
    pairStore.updateMoveInfo(name, { baseStat: headerVal });
  }, [name, headerVal]);

  return (
    <Collapse className="baseStats-collapse" defaultActiveKey={[name]}>
      <Collapse.Panel
        key={name}
        header={
          <>
            <div>Base Stat</div>
            {headerVal}
          </>
        }
      >
        <Form.Item name={[name, EBaseStatFormFields.STAT]} label="Raw Stat">
          <InputNumber min={0} />
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
};
