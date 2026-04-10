import React from "react";
import { Button, Form } from "antd";
import { BaseStats } from "../base-stats";
import { EBaseStatFormFields } from "../../types";
import s from "./s.m.scss";

export const DataRow = ({ stat }: { stat: number }) => {
  return (
    <Form layout="vertical">
      <Form.List name={EBaseStatFormFields.DATA_ROW}>
        {(fields, { add, remove }) => (
          <div className={s.dataRow}>
            {fields.map(field => (
              <div key={field.key}>
                <BaseStats stat={stat} name={String(field.name)} />
                <Button onClick={() => remove(field.name)}>Remove</Button>
              </div>
            ))}

            <Button onClick={() => add()}>Add</Button>
          </div>
        )}
      </Form.List>
    </Form>
  );
};
