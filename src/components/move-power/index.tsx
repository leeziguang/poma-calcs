import React, { useEffect, useMemo } from "react";
import { Checkbox, Collapse, Form, Input, InputNumber } from "antd";
import { observer } from "mobx-react";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import { EMoveCategory, EMoveFields } from "src/types/move";
import { moveStore } from "src/store/move";
import {
  calcDefaultMultis,
  calcMovePower,
  calcSyncPower,
  formToCalcArgAdaptor
} from "./helpers";
import "./style.scss";
import { usePairStore } from "src/store/pair-context";
import { EPairListFormFields } from "src/types";
import { passiveStore } from "src/store/passive";

interface IMovePowerProps {
  name: string;
  pairFieldName: number;
}

export const MovePower = observer(
  ({ name, pairFieldName }: IMovePowerProps) => {
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
    const optionsValue = colData?.[EMovePowerFormFields.OPTIONS];
    const isSync = optionsValue?.includes(EMovePowerFormFields.IS_SYNC);
    const moveId = colData?.[EMovePowerFormFields.MOVE_ID];
    const basePower = colData?.[EMovePowerFormFields.BASE_MOVE];
    const smpmun = colData?.[EMovePowerFormFields.SM_PMUN];
    const syun = colData?.[EMovePowerFormFields.SYUN];
    const multis = colData?.[EMovePowerFormFields.MULTIS];
    const innate = colData?.[EMovePowerFormFields.INNATE_MULTIS];
    const moveLvl = Form.useWatch(
      [EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MOVE_LVL],
      form
    );
    const trainerId = Form.useWatch(
      [EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.TRAINER_ID],
      form
    );
    const moveCategory = moveId
      ? (moveStore.moveMap[moveId]?.[EMoveFields.CATEGORY] as EMoveCategory)
      : undefined;
    const pairPassiveState = passiveStore.pairPassiveState.get(pairFieldName);
    const regionMembers = pairPassiveState?.regionMembers ?? 1;
    const extraPassives = pairPassiveState?.extraPassives ?? [];
    const conditionalParams = pairPassiveState?.conditionalParams ?? {};
    const defaultMultis = useMemo(
      () =>
        calcDefaultMultis(
          trainerId,
          passiveStore.passiveSkillDescriptionEn,
          passiveStore.passiveSkillChildren,
          isSync,
          { moveCategory, regionMembers, extraPassives, conditionalParams }
        ),
      [
        trainerId,
        passiveStore.passiveSkillDescriptionEn,
        passiveStore.passiveSkillChildren,
        isSync,
        moveId,
        regionMembers,
        extraPassives,
        conditionalParams
      ]
    );

    const args = formToCalcArgAdaptor(
      {
        [EMovePowerFormFields.BASE_MOVE]: basePower,
        [EMovePowerFormFields.MOVE_LVL]: moveLvl,
        [EMovePowerFormFields.OPTIONS]: optionsValue,
        [EMovePowerFormFields.SM_PMUN]: smpmun,
        [EMovePowerFormFields.SYUN]: syun,
        [EMovePowerFormFields.MULTIS]: multis,
        [EMovePowerFormFields.INNATE_MULTIS]: innate
      },
      trainerId,
      pairFieldName
    );
    const headerVal = isSync ? calcSyncPower(args) : calcMovePower(args);

    useEffect(() => {
      pairStore.updateMoveInfo(name, { movePower: headerVal });
    }, [name, headerVal]);

    useEffect(() => {
      form.setFieldValue(
        [
          EPairListFormFields.PAIR,
          pairFieldName,
          EPairListFormFields.DATA_COL,
          Number(name),
          EMovePowerFormFields.MULTIS
        ],
        defaultMultis || 0
      );
    }, [defaultMultis]);

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
              <Checkbox value={EMovePowerFormFields.IS_SYNC}>
                Sync Move
              </Checkbox>

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
            label="Base Power"
            name={[name, EMovePowerFormFields.BASE_MOVE]}
          >
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
  }
);
