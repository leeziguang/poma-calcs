import React from "react";
import { Collapse, Form, InputNumber, Select } from "antd";
import { statBoostOptions, statDropOptions } from "./constants";
import { EPairListFormFields } from "../../types";
import { EBaseStatFormFields } from "src/types/base-stats";
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
        const headerVal = calcBaseStat(
          getFieldValue(fieldPath(EBaseStatFormFields.STAT)),
          getFieldValue(fieldPath(EBaseStatFormFields.GRID)),
          getFieldValue(fieldPath(EBaseStatFormFields.STAT_BOOSTS)),
          getFieldValue(fieldPath(EBaseStatFormFields.DEF_DROPS))
        );

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
              <Form.Item
                name={[name, EBaseStatFormFields.STAT]}
                label="Raw Stat"
              >
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item
                name={[name, EBaseStatFormFields.GRID]}
                label="Grid Boost"
              >
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
      }}
    </Form.Item>
  );
};
