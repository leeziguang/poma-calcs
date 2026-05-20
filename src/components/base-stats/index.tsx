import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Collapse, Form, InputNumber, Select } from "antd";
import { statBoostOptions, statDropOptions } from "./constants";
import { EBaseStatFormFields } from "src/types/data-col-list/base-stats";
import { calcBaseStat, RAW_STAT_MAP } from "./helpers";
import { usePairStore } from "src/store/pair-context";
import { EPairListFormFields } from "src/types";
import { configStore } from "src/store/config";
import { EMonsterFields } from "src/types/monster";

import "./style.scss";

interface IBaseStatsProps {
  name: string;
  fieldPath: (string | number)[];
  pairFieldName: number;
}

export const BaseStats = observer(
  ({ name, fieldPath, pairFieldName }: IBaseStatsProps) => {
    const pairStore = usePairStore();
    const form = Form.useFormInstance();
    const pairs = Form.useWatch(EPairListFormFields.PAIR, form);
    const pairData = pairs?.[pairFieldName];
    const colData = pairData?.[EPairListFormFields.DATA_COL]?.[Number(name)];
    const stat = colData?.[EBaseStatFormFields.STAT];
    const moveLvl = pairData?.[EPairListFormFields.MOVE_LVL];
    const grid = colData?.[EBaseStatFormFields.GRID];
    const statBoost = colData?.[EBaseStatFormFields.STAT_BOOSTS];
    const defDrops = colData?.[EBaseStatFormFields.DEF_DROPS];
    const monsterId = pairData?.[EPairListFormFields.MONSTER_ID];
    const level = pairData?.[EPairListFormFields.LVL];

    // TODO: differentiate phys/spec split through move
    const autoStat = RAW_STAT_MAP(EMonsterFields.ATK_VALUES)[level];

    useEffect(() => {
      if (!configStore.isCustomMode) {
        form.setFieldValue([...fieldPath, EBaseStatFormFields.STAT], autoStat);
      }
    }, [monsterId, level, configStore.isCustomMode]);

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
            {configStore.isCustomMode ? (
              <InputNumber min={0} />
            ) : (
              <InputNumber disabled />
            )}
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
