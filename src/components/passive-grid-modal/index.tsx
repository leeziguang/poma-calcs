import React, { useMemo, useState } from "react";
import { Button, InputNumber, Select, Tooltip } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { passiveStore } from "src/store/passive";
import { IPairPassiveState } from "src/types/passive";
import {
  genAllPassiveOptions,
  genAbilityCellDisplayList,
  genPassiveList,
  passiveHasRegionTag
} from "./helpers";
import { PASSIVE_REGION_TAGS } from "src/components/move-power/constants";
import { CONDITIONAL_PASSIVE_INPUTS } from "./constants";
import "./style.scss";

interface IPassiveGridSiderProps {
  pairFieldName: number;
  trainerId: string | undefined;
}

const DEFAULT_STATE: IPairPassiveState = {
  regionMembers: 1,
  extraPassives: [],
  conditionalParams: {}
};

export const PassiveGridSider = observer(
  ({ pairFieldName, trainerId }: IPassiveGridSiderProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const state =
      passiveStore.pairPassiveState.get(pairFieldName) ?? DEFAULT_STATE;

    const update = (
      updater: (prev: IPairPassiveState) => IPairPassiveState
    ) => {
      const current = passiveStore.pairPassiveState.get(pairFieldName) ?? {
        ...DEFAULT_STATE
      };
      passiveStore.setPairPassiveState(pairFieldName, updater(current));
    };

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

    const allPassiveOptions = useMemo(
      () =>
        genAllPassiveOptions(
          passiveStore.passiveSkillNamesEn,
          passiveStore.passiveSkillNamePartsEn
        ),
      [passiveStore.passiveSkillNamesEn, passiveStore.passiveSkillNamePartsEn]
    );

    return (
      <div
        className={`passiveGridSider${
          collapsed ? " passiveGridSider--collapsed" : ""
        }`}
      >
        <button
          className="passiveGridSider-toggle"
          onClick={() => setCollapsed(c => !c)}
        >
          {collapsed ? (
            <Button type="link">Show Passives</Button>
          ) : (
            <Button type="link">Hide Passives</Button>
          )}
        </button>

        {!collapsed && (
          <div className="passiveGridSider-content">
            <div className="passiveGridSider-title">Passives / Grid</div>

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
                      <Tooltip
                        overlayClassName="passiveGridSider-tooltip"
                        title={desc}
                      >
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
                      <Select
                        value={state.regionMembers}
                        options={[1, 2, 3].map(n => ({ value: n, label: n }))}
                        onChange={val =>
                          update(prev => ({ ...prev, regionMembers: val }))
                        }
                        style={{ width: 64 }}
                      />
                    )}
                    {conditionalInput && (
                      <>
                        <span className="passiveGridSider-conditional-label">
                          {conditionalInput.label}
                        </span>
                        <InputNumber
                          min={conditionalInput.min}
                          max={conditionalInput.max}
                          precision={0}
                          value={
                            state.conditionalParams[opt.value as string] ??
                            conditionalInput.min
                          }
                          onChange={val =>
                            update(prev => ({
                              ...prev,
                              conditionalParams: {
                                ...prev.conditionalParams,
                                [opt.value as string]:
                                  val ?? conditionalInput.min
                              }
                            }))
                          }
                          style={{ width: 72 }}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {(() => {
              const cells = genAbilityCellDisplayList(trainerId ?? "");
              if (!cells.length) return null;
              return (
                <div style={{ marginTop: 12, width: "100%" }}>
                  <div className="passiveGridSider-extra-header">
                    <span>Ability Cells</span>
                  </div>
                  <div className="passiveGridSider-passives-list">
                    {cells.map(cell => (
                      <div
                        key={cell.cellId}
                        className="passiveGridSider-passives-row"
                      >
                        <span className="passiveGridSider-passive-name">
                          {cell.typeLabel}
                        </span>
                        <span
                          style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}
                        >
                          {[
                            cell.moveName,
                            cell.passiveName,
                            cell.value !== undefined
                              ? `+${cell.value}`
                              : undefined
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop: 12 }}>
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
              <div>
                {state.extraPassives.map((val, idx) => (
                  <div key={idx} className="passiveGridSider-extra-row">
                    <Select
                      value={val || undefined}
                      options={allPassiveOptions}
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
                    <DeleteOutlined
                      onClick={() =>
                        update(prev => ({
                          ...prev,
                          extraPassives: prev.extraPassives.filter(
                            (_, i) => i !== idx
                          )
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
