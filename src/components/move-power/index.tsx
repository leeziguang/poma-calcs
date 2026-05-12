import { Checkbox, Collapse, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import { EMovePowerFormFields, EPairListFormFields } from "src/types";
import { calcMovePower, calcSyncPower, formToCalcArgAdaptor } from "./helpers";
import { MOVE_LEVEL_OPTIONS } from "./constants";
import "./style.scss";

interface IMovePowerProps {
  name: string;
  pairName: number;
}

export const MovePower = ({ name, pairName }: IMovePowerProps) => {
  const fieldPath = (field: EMovePowerFormFields) => [
    EPairListFormFields.PAIR,
    pairName,
    EPairListFormFields.DATA_COL,
    name,
    field
  ];

  return (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => {
        const formVal = getFieldValue([
          EPairListFormFields.PAIR,
          pairName,
          EPairListFormFields.DATA_COL,
          name
        ]);

        const args = formToCalcArgAdaptor(formVal);
        const isSync = formVal?.[EMovePowerFormFields.OPTIONS]?.includes(
          EMovePowerFormFields.IS_SYNC
        );
        const optionsValue = getFieldValue(
          fieldPath(EMovePowerFormFields.OPTIONS)
        );
        const header = isSync ? calcSyncPower(args) : calcMovePower(args);

        return (
          <Collapse className="movePower-collapse" defaultActiveKey={[name]}>
            <Collapse.Panel key={name} header={header}>
              <Form.Item
                name={[name, EMovePowerFormFields.OPTIONS]}
                normalize={(values: EMovePowerFormFields[]) =>
                  values?.includes(EMovePowerFormFields.IS_SYNC)
                    ? values.filter(v => v !== EMovePowerFormFields.IS_TERA)
                    : values
                }
              >
                <Checkbox.Group>
                  <Checkbox value={EMovePowerFormFields.IS_SYNC}>
                    Sync Move
                  </Checkbox>

                  {optionsValue?.includes(EMovePowerFormFields.IS_SYNC) ? (
                    <Checkbox value={EMovePowerFormFields.IS_TECH}>
                      Tech
                    </Checkbox>
                  ) : (
                    <></>
                  )}

                  <Checkbox
                    value={EMovePowerFormFields.IS_TERA}
                    disabled={optionsValue?.includes(
                      EMovePowerFormFields.IS_SYNC
                    )}
                  >
                    Tera
                  </Checkbox>
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
                <InputNumber />
              </Form.Item>

              <Form.Item
                label="Grid Boost"
                name={[name, EMovePowerFormFields.GRID]}
              >
                <InputNumber />
              </Form.Item>

              {isSync ? (
                <Form.Item
                  label="SyUN"
                  name={[name, EMovePowerFormFields.SYUN]}
                >
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

              {/* TODO: refactor this to multi select of passive/grid multis instead */}
              {/* TODO: how to handle regional passives? global store to contain team mate profiles? context provider? */}
              <Form.Item
                label="Passive & Grid Multis"
                name={[name, EMovePowerFormFields.MULTIS]}
              >
                <InputNumber step={0.1} />
              </Form.Item>

              <Form.Item
                label="Innate Multis"
                name={[name, EMovePowerFormFields.INNATE_MULTIS]}
              >
                <InputNumber step={0.1} />
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
      }}
    </Form.Item>
  );
};
