import React, { useCallback, useMemo } from "react";
import { Form } from "antd";
import { EPairListFormFields } from "src/types";
import { Select, Tooltip } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { passiveStore } from "src/store/passive";
import { IPairPassiveState } from "src/types/passive";
import {
  genAbilityCellDisplayList,
  genPassiveList,
  passiveHasRegionTag
} from "./helpers";
import { HexAbilityGrid } from "src/components/hex-ability-grid";
import { MemberNumSelect } from "src/components/member-num-select";
import { PASSIVE_REGION_TAGS } from "src/components/move-power/constants";
import {
  CONDITIONAL_PASSIVE_INPUTS,
  DEFAULT_STATE,
  EXTRA_PASSIVE_OPT
} from "./constants";
import "./style.scss";

interface IPassiveGridSiderProps {
  pairFieldName: number;
  trainerId: string | undefined;
}

type IUpdater = (
  updater: (prev: IPairPassiveState) => IPairPassiveState
) => void;

interface IPassiveListProps {
  passiveOptions: ReturnType<typeof genPassiveList>;
  childMap: Record<number, string[]>;
  regionMembers: number;
  conditionalParams: IPairPassiveState["conditionalParams"];
  update: IUpdater;
}

const PassiveList = React.memo(
  ({
    passiveOptions,
    childMap,
    regionMembers,
    conditionalParams,
    update
  }: IPassiveListProps) => (
    <div className="passiveGridSider-passives-list">
      {passiveOptions.map(opt => {
        const passiveId = Number(opt.value);
        const desc = (opt.children ?? [])
          .map((c: { title?: React.ReactNode }) =>
            typeof c.title === "string" ? c.title : ""
          )
          .filter(Boolean)
          .join("\n");

        const isRegional = passiveHasRegionTag(
          passiveId,
          passiveStore.passiveSkillDescriptionEn,
          childMap,
          PASSIVE_REGION_TAGS
        );

        const conditionalInput =
          CONDITIONAL_PASSIVE_INPUTS[opt.value as string];

        return (
          <div
            key={String(opt.value)}
            className="passiveGridSider-passives-row"
          >
            {desc ? (
              <Tooltip overlayClassName="passiveGridSider-tooltip" title={desc}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : (
              <span className="passiveGridSider-passives-row-placeholder-icon" />
            )}
            <span
              className={`passiveGridSider-passive-name${
                isRegional ? "-with-regional-select" : ""
              }`}
            >
              {opt.title}
            </span>
            {isRegional && (
              <MemberNumSelect
                value={regionMembers}
                onChange={val =>
                  update(prev => ({ ...prev, regionMembers: val }))
                }
              />
            )}
            {conditionalInput && (
              <>
                <span className="passiveGridSider-conditional-label">
                  {conditionalInput.label}
                </span>
                <MemberNumSelect
                  value={
                    conditionalParams[opt.value as string] ??
                    conditionalInput.min
                  }
                  onChange={val =>
                    update(prev => ({
                      ...prev,
                      conditionalParams: {
                        ...prev.conditionalParams,
                        [opt.value as string]: val
                      }
                    }))
                  }
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  )
);

interface IExtraPassivesListProps {
  extraPassives: IPairPassiveState["extraPassives"];
  conditionalParams: IPairPassiveState["conditionalParams"];
  update: IUpdater;
}

const ExtraPassivesList = React.memo(
  ({ extraPassives, conditionalParams, update }: IExtraPassivesListProps) => (
    <div className="passiveGridSider-extra">
      <div className="passiveGridSider-extra-header">
        <span>Extra Passives</span>
        <PlusCircleOutlined
          onClick={() =>
            update(prev => ({
              ...prev,
              extraPassives: [...prev.extraPassives, ""]
            }))
          }
        />
      </div>

      {extraPassives.map((val, idx) => {
        const conditionalInput = val
          ? CONDITIONAL_PASSIVE_INPUTS[val]
          : undefined;
        return (
          <div key={idx} className="passiveGridSider-extra-row">
            <Select
              value={val || undefined}
              options={EXTRA_PASSIVE_OPT}
              onChange={newVal =>
                update(prev => {
                  const next = [...prev.extraPassives];
                  next[idx] = newVal;
                  return { ...prev, extraPassives: next };
                })
              }
              dropdownMatchSelectWidth={false}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              className="passiveGridSider-extra-select"
            />
            {conditionalInput && (
              <MemberNumSelect
                value={
                  conditionalParams[`extra_${idx}`] ?? conditionalInput.min
                }
                onChange={v =>
                  update(prev => ({
                    ...prev,
                    conditionalParams: {
                      ...prev.conditionalParams,
                      [`extra_${idx}`]: v
                    }
                  }))
                }
              />
            )}
            <DeleteOutlined
              onClick={() =>
                update(prev => ({
                  ...prev,
                  extraPassives: prev.extraPassives.filter((_, i) => i !== idx)
                }))
              }
            />
          </div>
        );
      })}
    </div>
  )
);

export const PassiveGridSider = observer(
  ({ pairFieldName, trainerId }: IPassiveGridSiderProps) => {
    const form = Form.useFormInstance();
    const moveLvl = Form.useWatch(
      [EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MOVE_LVL],
      form
    );
    const state =
      passiveStore.pairPassiveState.get(pairFieldName) ?? DEFAULT_STATE;

    const update = useCallback(
      (updater: (prev: IPairPassiveState) => IPairPassiveState) => {
        const current =
          passiveStore.pairPassiveState.get(pairFieldName) ?? DEFAULT_STATE;
        passiveStore.setPairPassiveState(pairFieldName, updater(current));
      },
      [pairFieldName]
    );

    const passiveOptions = useMemo(
      () =>
        genPassiveList(
          trainerId as string,
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

    const childMap = useMemo(
      () =>
        passiveStore.passiveSkillChildren.reduce<Record<number, string[]>>(
          (acc, c) => {
            acc[c.passiveSkillId] = c.passiveSkillChildIds;
            return acc;
          },
          {}
        ),
      [passiveStore.passiveSkillChildren]
    );

    const gridTiles = useMemo(
      () => genAbilityCellDisplayList(trainerId ?? ""),
      [trainerId]
    );

    const handleGridSelectionChange = useCallback(
      (ids: Set<number>) => {
        passiveStore.setSelectedGridCellIds(pairFieldName, Array.from(ids));
      },
      [pairFieldName]
    );

    return (
      <div className="passiveGridSider">
        <div className="passiveGridSider-content">
          <div className="passiveGridSider-title">Passives / Grid</div>

          <PassiveList
            passiveOptions={passiveOptions}
            childMap={childMap}
            regionMembers={state.regionMembers}
            conditionalParams={state.conditionalParams}
            update={update}
          />

          <div className="passiveGridSider-ability">
            <div className="passiveGridSider-ability-header">
              <span>Grid</span>
            </div>
            <HexAbilityGrid
              cells={gridTiles}
              moveLvl={moveLvl}
              onSelectionChange={handleGridSelectionChange}
            />
          </div>

          <ExtraPassivesList
            extraPassives={state.extraPassives}
            conditionalParams={state.conditionalParams}
            update={update}
          />
        </div>
      </div>
    );
  }
);
