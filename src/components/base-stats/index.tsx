import React from "react";
import { Collapse, Form, InputNumber, Select } from "antd";
import { statBoostOptions, statDropOptions } from "./constants";
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
    EPairListFormFields.DATA_COL,
    name,
    field
  ];

  return (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => {
        const header = calcBaseStat(
          getFieldValue(fieldPath(EBaseStatFormFields.STAT)),
          getFieldValue(fieldPath(EBaseStatFormFields.GRID)),
          getFieldValue(fieldPath(EBaseStatFormFields.STAT_BOOSTS)),
          getFieldValue(fieldPath(EBaseStatFormFields.DEF_DROPS))
        );

        return (
          <Collapse className="baseStats-collapse" defaultActiveKey={[name]}>
            <Collapse.Panel key={name} header={header}>
              <Form.Item
                name={[name, EBaseStatFormFields.STAT]}
                label="Raw Stat"
              >
                <InputNumber />
              </Form.Item>

              <Form.Item
                name={[name, EBaseStatFormFields.GRID]}
                label="Grid Boost"
              >
                <InputNumber />
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
      }}
    </Form.Item>
  );
};
