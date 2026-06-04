import React, { useEffect, useMemo, useState } from "react";
import { InputNumber, Modal, Select, Tooltip } from "antd";
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
  genPassiveList,
  passiveHasRegionTag
} from "./helpers";
import { PASSIVE_REGION_TAGS } from "src/components/move-power/constants";
import { CONDITIONAL_PASSIVE_INPUTS } from "./constants";
import "./style.scss";

interface IPassiveGridModalProps {
  pairFieldName: number;
  trainerId: string | undefined;
  open: boolean;
  onClose: () => void;
}

const DEFAULT_STATE: IPairPassiveState = {
  regionMembers: 1,
  extraPassives: [],
  conditionalParams: {}
};

export const PassiveGridModal = observer(
  ({ pairFieldName, trainerId, open, onClose }: IPassiveGridModalProps) => {
    const [draft, setDraft] = useState<IPairPassiveState>({
      ...DEFAULT_STATE
    });

    useEffect(() => {
      if (open) {
        setDraft(
          passiveStore.pairPassiveState.get(pairFieldName) ?? {
            ...DEFAULT_STATE
          }
        );
      }
    }, [open]);

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

    const commit = (state: IPairPassiveState) => {
      passiveStore.setPairPassiveState(pairFieldName, state);
      onClose();
    };

    return (
      <Modal
        title="Passives / Grid"
        open={open}
        onOk={() => commit(draft)}
        onCancel={() => commit(draft)}
        width={480}
        destroyOnClose={false}
      >
        <div className="passiveGridModal-passives-list">
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
                className="passiveGridModal-passive-row"
              >
                {desc ? (
                  <Tooltip
                    overlayClassName="passiveGridModal-tooltip"
                    title={desc}
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                ) : null}
                <span className="passiveGridModal-passive-name">
                  {opt.title}
                </span>
                {isRegional && (
                  <Select
                    value={draft.regionMembers}
                    options={[1, 2, 3].map(n => ({ value: n, label: n }))}
                    onChange={val =>
                      setDraft(prev => ({ ...prev, regionMembers: val }))
                    }
                    style={{ width: 64 }}
                  />
                )}
                {conditionalInput && (
                  <>
                    <span className="passiveGridModal-conditional-label">
                      {conditionalInput.label}
                    </span>
                    <InputNumber
                      min={conditionalInput.min}
                      max={conditionalInput.max}
                      precision={0}
                      value={
                        draft.conditionalParams[opt.value as string] ??
                        conditionalInput.min
                      }
                      onChange={val =>
                        setDraft(prev => ({
                          ...prev,
                          conditionalParams: {
                            ...prev.conditionalParams,
                            [opt.value as string]: val ?? conditionalInput.min
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

        <div style={{ marginTop: 12 }}>
          <div className="passiveGridModal-extra-header">
            <span>Extra Passives</span>
            <PlusCircleOutlined
              onClick={() =>
                setDraft(prev => ({
                  ...prev,
                  extraPassives: [...prev.extraPassives, ""]
                }))
              }
            />
          </div>
          <div>
            {draft.extraPassives.map((val, idx) => (
              <div key={idx} className="passiveGridModal-extra-row">
                <Select
                  value={val || undefined}
                  options={allPassiveOptions}
                  onChange={newVal =>
                    setDraft(prev => {
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
                  className="passiveGridModal-extra-select"
                />
                <DeleteOutlined
                  onClick={() =>
                    setDraft(prev => ({
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
      </Modal>
    );
  }
);
