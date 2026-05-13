import React, { useEffect } from "react";
import { Checkbox, Collapse, Form, Input, InputNumber, Select } from "antd";
import { EMovePowerFormFields } from "src/types/move-power";
import { calcMovePower, calcSyncPower, formToCalcArgAdaptor } from "./helpers";
import { MOVE_LEVEL_OPTIONS } from "./constants";
import "./style.scss";
import { pairStore } from "src/store/pair";

interface IMovePowerProps {
  name: string;
  fieldPath: (string | number)[];
}

export const MovePower = ({ name, fieldPath }: IMovePowerProps) => {
  const form = Form.useFormInstance();
  const baseMove = Form.useWatch(
    [...fieldPath, EMovePowerFormFields.BASE_MOVE],
    form
  );
  const moveLvl = Form.useWatch(
    [...fieldPath, EMovePowerFormFields.MOVE_LVL],
    form
  );
  const grid = Form.useWatch([...fieldPath, EMovePowerFormFields.GRID], form);
  const smPmun = Form.useWatch(
    [...fieldPath, EMovePowerFormFields.SM_PMUN],
    form
  );
  const syun = Form.useWatch([...fieldPath, EMovePowerFormFields.SYUN], form);
  const multis = Form.useWatch(
    [...fieldPath, EMovePowerFormFields.MULTIS],
    form
  );
  const innateMultis = Form.useWatch(
    [...fieldPath, EMovePowerFormFields.INNATE_MULTIS],
    form
  );
  const optionsValue = Form.useWatch(
    [...fieldPath, EMovePowerFormFields.OPTIONS],
    form
  );

  const isSync = optionsValue?.includes(EMovePowerFormFields.IS_SYNC);

  const args = formToCalcArgAdaptor({
    [EMovePowerFormFields.BASE_MOVE]: baseMove,
    [EMovePowerFormFields.MOVE_LVL]: moveLvl,
    [EMovePowerFormFields.GRID]: grid,
    [EMovePowerFormFields.SM_PMUN]: smPmun,
    [EMovePowerFormFields.SYUN]: syun,
    [EMovePowerFormFields.MULTIS]: multis,
    [EMovePowerFormFields.INNATE_MULTIS]: innateMultis,
    [EMovePowerFormFields.OPTIONS]: optionsValue
  });
  const headerVal = isSync ? calcSyncPower(args) : calcMovePower(args);

  useEffect(() => {
    pairStore.updateMoveInfo(name, { movePower: headerVal });
  }, [name, headerVal]);

  return (
    <Collapse
      className="movePower-collapse"
      defaultActiveKey={["move-power-panel"]}
    >
      <Collapse.Panel
        key="move-power-panel"
        header={
          <>
            <div>Move Power</div>
            {headerVal?.toLocaleString(undefined, {
              maximumFractionDigits: 6
            })}
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
