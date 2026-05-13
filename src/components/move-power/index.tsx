import React, { useEffect, useMemo } from "react";
import { Checkbox, Collapse, Form, Input, InputNumber, Select } from "antd";
import { EPairListFormFields } from "src/types";
import { EMovePowerFormFields } from "src/types/move-power";
import { calcMovePower, calcSyncPower, formToCalcArgAdaptor } from "./helpers";
import { MOVE_LEVEL_OPTIONS } from "./constants";
import "./style.scss";
import { pairStore } from "src/store/pair";

interface IMovePowerProps {
  name: string;
  pairName: number;
}

export const MovePower = ({ name, pairName }: IMovePowerProps) => {
  const formVal = Form.useWatch([
    EPairListFormFields.PAIR,
    pairName,
    EPairListFormFields.DATA_COL,
    name
  ]);

  const optionsValue = formVal?.[EMovePowerFormFields.OPTIONS];
  const isSync = optionsValue?.includes(EMovePowerFormFields.IS_SYNC);

  const args = useMemo(() => formToCalcArgAdaptor(formVal), [formVal]);
  const headerVal = useMemo(
    () => (isSync ? calcSyncPower(args) : calcMovePower(args)),
    [isSync, args]
  );

  useEffect(() => {
    pairStore.updateMoveInfo(name, { movePower: headerVal });
  }, [name, headerVal]);

  return (
    <Collapse className="movePower-collapse" defaultActiveKey={[name]}>
      <Collapse.Panel
        key={name}
        header={
          <>
            <div>Move Power</div>
            {headerVal}
          </>
        }
      >
        <Form.Item
          name={[name, EMovePowerFormFields.OPTIONS]}
          normalize={(values: EMovePowerFormFields[]) => {
            let result = values;
            if (result?.includes(EMovePowerFormFields.IS_SYNC)) {
              result = result.filter(v => v !== EMovePowerFormFields.IS_TERA);
            }

            const showIgnoreAoe =
              result?.includes(EMovePowerFormFields.IS_AOE) &&
              !result?.includes(EMovePowerFormFields.IS_SYNC);
            if (!showIgnoreAoe) {
              result = result?.filter(
                v => v !== EMovePowerFormFields.IGNORE_AOE_PENALTY
              );
            }

            return result;
          }}
        >
          <Checkbox.Group className="movePower-checkbox-group">
            <Checkbox value={EMovePowerFormFields.IS_SYNC}>Sync Move</Checkbox>

            {optionsValue?.includes(EMovePowerFormFields.IS_SYNC) ? (
              <Checkbox value={EMovePowerFormFields.IS_TECH}>Tech</Checkbox>
            ) : (
              <></>
            )}

            <Checkbox
              value={EMovePowerFormFields.IS_TERA}
              disabled={optionsValue?.includes(EMovePowerFormFields.IS_SYNC)}
            >
              Tera
            </Checkbox>

            <Checkbox value={EMovePowerFormFields.IS_AOE}>AOE</Checkbox>

            {optionsValue?.includes(EMovePowerFormFields.IS_AOE) &&
            !optionsValue?.includes(EMovePowerFormFields.IS_SYNC) ? (
              <Checkbox value={EMovePowerFormFields.IGNORE_AOE_PENALTY}>
                Ignore AOE Penalty
              </Checkbox>
            ) : (
              <></>
            )}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Move Level"
          name={[name, EMovePowerFormFields.MOVE_LVL]}
        >
          <Select options={MOVE_LEVEL_OPTIONS} />
        </Form.Item>

        <Form.Item
          label="Base Power"
          name={[name, EMovePowerFormFields.BASE_MOVE]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="Grid Boost" name={[name, EMovePowerFormFields.GRID]}>
          <InputNumber min={0} />
        </Form.Item>

        {isSync ? (
          <Form.Item label="SyUN" name={[name, EMovePowerFormFields.SYUN]}>
            <InputNumber min={0} max={10} precision={0} />
          </Form.Item>
        ) : (
          <Form.Item
            label="SM/PMUN"
            name={[name, EMovePowerFormFields.SM_PMUN]}
          >
            <InputNumber min={0} max={10} precision={0} />
          </Form.Item>
        )}

        <Form.Item
          label="Passive & Grid Multis"
          name={[name, EMovePowerFormFields.MULTIS]}
        >
          <InputNumber step={0.1} min={0} />
        </Form.Item>

        <Form.Item
          label="Innate Multis"
          name={[name, EMovePowerFormFields.INNATE_MULTIS]}
        >
          <InputNumber step={0.1} min={0} />
        </Form.Item>

        <Form.Item
          label="Extra Notes"
          name={[name, EMovePowerFormFields.EXTRA_NOTES]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  );
};
