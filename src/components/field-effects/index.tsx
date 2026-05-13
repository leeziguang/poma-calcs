import React, { useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select
} from "antd";
import { EPairListFormFields } from "src/types";
import { ECircle, EFieldEffectFormFields } from "src/types/field-effect";
import {
  CIRCLE_MULTI_MAP,
  CIRCLE_OPTIONS,
  MEMBER_OPTIONS,
  REBUFF_OPTIONS,
  WTZ_OPTIONS
} from "./constants";
import "./style.scss";
import { calcFieldEffect } from "./helpers";
import { pairStore } from "src/store/pair";

interface IFieldEffectProps {
  name: string;
  pairName: number;
}

export const FieldEffect = ({ name, pairName }: IFieldEffectProps) => {
  const formVal = Form.useWatch([
    EPairListFormFields.PAIR,
    pairName,
    EPairListFormFields.DATA_COL,
    name
  ]);

  const headerVal = useMemo(
    () =>
      calcFieldEffect({
        syncBoosts: formVal?.[EFieldEffectFormFields.SYNC_BOOSTS],
        wtz: formVal?.[EFieldEffectFormFields.WTZ],
        circle: formVal?.[EFieldEffectFormFields.CIRCLE],
        rebuff: formVal?.[EFieldEffectFormFields.REBUFF],
        seun: formVal?.[EFieldEffectFormFields.SEUN]
      }),
    [formVal]
  );

  useEffect(() => {
    pairStore.updateMoveInfo(name, { fieldEffect: headerVal });
  }, [name, headerVal]);

  return (
    <Collapse className="fieldEffect-collapse" defaultActiveKey={[name]}>
      <Collapse.Panel
        key={name}
        header={
          <>
            <div>Field Effect</div>
            {headerVal}
          </>
        }
      >
        <Form.Item
          label="Sync Boosts"
          name={[name, EFieldEffectFormFields.SYNC_BOOSTS]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="WTZ" name={[name, EFieldEffectFormFields.WTZ]}>
          <Select options={WTZ_OPTIONS} />
        </Form.Item>

        <Form.List name={[name, EFieldEffectFormFields.CIRCLE]}>
          {(fields, { add, remove }) => {
            return (
              <Card className="fieldEffect-circle-card">
                <span>
                  Circle{" "}
                  {fields?.length < 9 ? (
                    <Button onClick={add}>+</Button>
                  ) : (
                    <></>
                  )}
                </span>
                {fields?.map(field => (
                  <div key={field.key} className="fieldEffect-circle-wrapper">
                    <Form.Item
                      label="Circle Type"
                      name={[field.name, EFieldEffectFormFields.CIRCLE_MULTI]}
                      initialValue={CIRCLE_MULTI_MAP[ECircle.PHYS_SPEC]}
                    >
                      <Select
                        options={CIRCLE_OPTIONS}
                        className="fieldEffect-circle-type"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Members"
                      name={[field.name, EFieldEffectFormFields.MEMBERS]}
                      initialValue={1}
                    >
                      <Select
                        options={MEMBER_OPTIONS}
                        className="fieldEffect-circle-members"
                      />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)}>-</Button>
                  </div>
                ))}
              </Card>
            );
          }}
        </Form.List>

        <Form.Item label="Rebuff" name={[name, EFieldEffectFormFields.REBUFF]}>
          <Select options={REBUFF_OPTIONS} />
        </Form.Item>

        <Form.Item
          name={[name, EFieldEffectFormFields.SEUN]}
          valuePropName="checked"
        >
          <Checkbox value={3}>SEUN</Checkbox>
        </Form.Item>

        <Form.Item
          label="Extra Notes"
          name={[name, EFieldEffectFormFields.EXTRA_NOTES]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Collapse.Panel>
    </Collapse>
  );
};
