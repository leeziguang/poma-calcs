import React, { useEffect } from "react";
import {
  Card,
  Checkbox,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select
} from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  ECircle,
  EFieldEffectFormFields
} from "src/types/data-col-list/field-effect";
import { EPairListFormFields } from "src/types";
import {
  CIRCLE_MULTI_MAP,
  CIRCLE_OPTIONS,
  REBUFF_OPTIONS,
  WTZ_OPTIONS
} from "./constants";
import "./style.scss";
import { calcFieldEffect } from "./helpers";
import { MemberNumSelect } from "src/components/member-num-select";
import { usePairStore } from "src/store/pair-context";

interface IFieldEffectProps {
  name: string;
  pairFieldName: number;
}

export const FieldEffect = ({ name, pairFieldName }: IFieldEffectProps) => {
  const pairStore = usePairStore();
  const form = Form.useFormInstance();
  const colIndex = Number(name);
  const colData = Form.useWatch(
    [
      EPairListFormFields.PAIR,
      pairFieldName,
      EPairListFormFields.DATA_COL,
      colIndex
    ],
    form
  );
  const syncBoosts = colData?.[EFieldEffectFormFields.SYNC_BOOSTS];
  const wtz = colData?.[EFieldEffectFormFields.WTZ];
  const circle = colData?.[EFieldEffectFormFields.CIRCLE];
  const rebuff = colData?.[EFieldEffectFormFields.REBUFF];
  const seun = colData?.[EFieldEffectFormFields.SEUN];

  const headerVal = calcFieldEffect({ syncBoosts, wtz, circle, rebuff, seun });

  useEffect(() => {
    pairStore.updateMoveInfo(name, { fieldEffect: headerVal });
  }, [name, headerVal]);

  return (
    <Collapse
      className="fieldEffect-collapse"
      defaultActiveKey={["field-effect-panel"]}
    >
      <Collapse.Panel
        key="field-effect-panel"
        header={
          <>
            <div>Field Effect</div>
            {headerVal?.toLocaleString(undefined, {
              maximumFractionDigits: 6
            })}
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
                <div className="fieldEffect-circle-card-title">
                  <span>Circle</span>
                  {fields?.length < 9 ? (
                    <PlusCircleOutlined onClick={add} />
                  ) : (
                    <></>
                  )}
                </div>
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
                      <MemberNumSelect className="fieldEffect-circle-members" />
                    </Form.Item>
                    <DeleteOutlined onClick={() => remove(field.name)} />
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
