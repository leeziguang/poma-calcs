import React from "react";
import { Card, Form, InputNumber, Select } from "antd";
import { statBoostOptions, statDropOptions } from "./constants";
import { EStatBoost } from "../../types/base-stats";
import { EBaseStatFormFields, EPairListFormFields } from "../../types";
import { calcBaseStat } from "./helpers";
import "./style.scss";

interface IBaseStatsProps {
  name: string;
  pairName: number;
}

export const BaseStats = ({ name, pairName }: IBaseStatsProps) => {
  const fieldPath = (field: EBaseStatFormFields) => [
    EPairListFormFields.PAIR,
    pairName,
    EBaseStatFormFields.DATA_COL,
    name,
    field
  ];

  return (
    <Card className="baseStats-card">
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          return (
            <span>
              {calcBaseStat(
                getFieldValue(fieldPath(EBaseStatFormFields.STAT)),
                getFieldValue(fieldPath(EBaseStatFormFields.GRID)),
                getFieldValue(fieldPath(EBaseStatFormFields.STAT_BOOSTS)),
                getFieldValue(fieldPath(EBaseStatFormFields.DEF_DROPS))
              )}
            </span>
          );
        }}
      </Form.Item>

      <Form.Item name={[name, EBaseStatFormFields.STAT]} label="Raw Stat">
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={[name, EBaseStatFormFields.GRID]}
        label="Grid Boost"
        initialValue={0}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={[name, EBaseStatFormFields.STAT_BOOSTS]}
        label="Stat Boost"
        initialValue={EStatBoost.PLUS_6}
      >
        <Select options={statBoostOptions} />
      </Form.Item>

      <Form.Item
        name={[name, EBaseStatFormFields.DEF_DROPS]}
        label="Def Drops"
        initialValue={EStatBoost.ZERO}
      >
        <Select options={statDropOptions} />
      </Form.Item>
    </Card>
  );
};
