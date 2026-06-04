import React, { useEffect, useMemo } from "react";
import {
  Checkbox,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip
} from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { EMovePowerFormFields } from "src/types/data-col-list/move-power";
import { EMoveCategory, EMoveFields } from "src/types/move";
import { moveStore } from "src/store/move";
import {
  calcDefaultMultis,
  calcMovePower,
  calcSyncPower,
  formToCalcArgAdaptor,
  genPassiveList,
  passiveHasRegionTag
} from "./helpers";
import { PASSIVE_REGION_TAGS } from "./constants";
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
    const pairs = Form.useWatch(EPairListFormFields.PAIR, form);
    const pairData = pairs?.[pairFieldName];
    const colData = pairData?.[EPairListFormFields.DATA_COL]?.[Number(name)];
    const optionsValue = colData?.[EMovePowerFormFields.OPTIONS];
    const isSync = optionsValue?.includes(EMovePowerFormFields.IS_SYNC);
    const moveId = colData?.[EMovePowerFormFields.MOVE_ID];
    const moveCategory = moveId
      ? (moveStore.moveMap[moveId]?.[EMoveFields.CATEGORY] as EMoveCategory)
      : undefined;
    const regionMembers = colData?.[EMovePowerFormFields.REGION_MEMBERS] ?? 0;
    const trainerId = pairData?.[EPairListFormFields.TRAINER_ID];

    const passiveOptions = useMemo(
      () =>
        genPassiveList(
          trainerId,
          passiveStore.passiveSkillNamesEn,
          passiveStore.passiveSkillNamePartsEn,
          passiveStore.passiveSkillChildren
        ),
      [
        trainerId,
        passiveStore.passiveSkillNamesEn,
        passiveStore.passiveSkillNamePartsEn,
        passiveStore.passiveSkillChildren
      ]
    );

    const hasRegionPassive = useMemo(() => {
      const childMap = passiveStore.passiveSkillChildren.reduce<
        Record<number, string[]>
      >((acc, c) => {
        acc[c.passiveSkillId] = c.passiveSkillChildIds;
        return acc;
      }, {});
      return passiveOptions.some(opt =>
        passiveHasRegionTag(
          Number(opt.value),
          passiveStore.passiveSkillDescriptionEn,
          childMap,
          PASSIVE_REGION_TAGS
        )
      );
    }, [
      passiveOptions,
      passiveStore.passiveSkillChildren,
      passiveStore.passiveSkillDescriptionEn
    ]);

    const defaultMultis = useMemo(
      () =>
        calcDefaultMultis(
          trainerId,
          passiveStore.passiveSkillDescriptionEn,
          passiveStore.passiveSkillChildren,
          isSync,
          { moveCategory, regionMembers }
        ),
      [
        trainerId,
        passiveStore.passiveSkillDescriptionEn,
        passiveStore.passiveSkillChildren,
        isSync,
        moveId,
        regionMembers
      ]
    );

    const args = formToCalcArgAdaptor({
      ...colData,
      [EMovePowerFormFields.MOVE_LVL]: pairData?.[EPairListFormFields.MOVE_LVL]
    });
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

    const renderDefaultPassive = () => (
      <Collapse className="movePower-passives-collapse">
        <Collapse.Panel
          key="default-passives-panel"
          header={<span className="movePower-passives-title">Passives</span>}
        >
          <div className="movePower-passives-list">
            {passiveOptions.map(opt => {
              const desc = (opt.children ?? [])
                .map((c: { title?: React.ReactNode }) =>
                  typeof c.title === "string" ? c.title : ""
                )
                .filter(Boolean)
                .join("\n");
              return (
                <div
                  key={String(opt.value)}
                  className="movePower-passives-default-row"
                >
                  {desc ? (
                    <Tooltip
                      overlayClassName="movePower-passives-tooltip"
                      title={desc}
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  ) : null}
                  <span>{opt.title}</span>
                </div>
              );
            })}
          </div>
        </Collapse.Panel>
      </Collapse>
    );

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

          <Form.Item
            label="Grid Boost"
            name={[name, EMovePowerFormFields.GRID]}
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

          {renderDefaultPassive()}

          {hasRegionPassive ? (
            <Form.Item
              label="Region Members"
              name={[name, EMovePowerFormFields.REGION_MEMBERS]}
              initialValue={1}
            >
              <Select
                options={[1, 2, 3].map(n => ({ value: n, label: n }))}
                allowClear
              />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.List name={[name, EMovePowerFormFields.PASSIVES]}>
            {(fields, { add, remove }) => (
              <div className="movePower-passives">
                <div className="movePower-passives-title">
                  <span>Extra Passives</span>
                  <PlusCircleOutlined onClick={() => add()} />
                </div>
                <div className="movePower-passives-list">
                  {fields.map(field => (
                    <div key={field.key} className="movePower-passives-row">
                      <Form.Item name={field.name} noStyle>
                        <Select
                          options={[]}
                          dropdownMatchSelectWidth={false}
                          className="movePower-passives-select"
                        />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(field.name)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.List>

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
