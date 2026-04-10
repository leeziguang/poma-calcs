import React from "react";
import { Form, InputNumber, Select } from "antd";
import { STAT_BOOST_LABEL } from "./constants";
import { EStatBoost } from "../../types/base-stats";
import { EBaseStatFormFields } from "../../types";
import { calcBaseStat } from "./helpers";

interface IBaseStatsProps {
  stat: number;
  name: string;
}

const statBoostSelectOptions = (Object.keys(EStatBoost) as EStatBoost[]).map(
  boost => ({
    label: STAT_BOOST_LABEL[boost],
    value: boost
  })
);

export const BaseStats = ({ stat, name }: IBaseStatsProps) => {
  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          return (
            <span>
              {calcBaseStat(
                stat,
                getFieldValue([
                  EBaseStatFormFields.DATA_ROW,
                  name,
                  EBaseStatFormFields.GRID
                ]),
                getFieldValue([
                  EBaseStatFormFields.DATA_ROW,
                  name,
                  EBaseStatFormFields.STAT_BOOSTS
                ]),
                getFieldValue([
                  EBaseStatFormFields.DATA_ROW,
                  name,
                  EBaseStatFormFields.DEF_DROPS
                ])
              )}
            </span>
          );
        }}
      </Form.Item>
      <Form.Item name={[name, EBaseStatFormFields.GRID]}>
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={[name, EBaseStatFormFields.STAT_BOOSTS]}
        label="Stat Boost"
        initialValue={EStatBoost.ZERO}
      >
        <Select options={statBoostSelectOptions} />
      </Form.Item>
      <Form.Item
        name={[name, EBaseStatFormFields.DEF_DROPS]}
        label="Def Drops"
        initialValue={EStatBoost.ZERO}
      >
        <Select options={statBoostSelectOptions.reverse()} />
      </Form.Item>
    </>
  );
};
