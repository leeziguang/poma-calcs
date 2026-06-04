import React, { useState } from "react";
import { observer } from "mobx-react";
import { Form, Tooltip } from "antd";
import { EPairListFormFields } from "src/types";
import { PairStore } from "src/store/pair";
import { configStore } from "src/store/config";
import { formatMoveLevel, getPercent } from "src/lib/helpers";
import { RenameableTitle } from "src/components/renameable-title";

export const TabLabel = observer(
  ({
    name,
    fieldName,
    store,
    firstStore,
    onRename
  }: {
    name: string;
    fieldName: number;
    store: PairStore;
    firstStore: PairStore | undefined;
    onRename: (val: string) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = Form.useFormInstance();
    const pairs = Form.useWatch(EPairListFormFields.PAIR, form);
    const level = pairs?.[fieldName]?.[EPairListFormFields.LVL];
    const moveLevel = pairs?.[fieldName]?.[EPairListFormFields.MOVE_LVL];
    const moves: number =
      Form.useWatch(
        [EPairListFormFields.PAIR, fieldName, EPairListFormFields.MOVES],
        form
      ) ?? 1;
    const firstMoves: number =
      Form.useWatch(
        [EPairListFormFields.PAIR, 0, EPairListFormFields.MOVES],
        form
      ) ?? 1;
    const percent = firstStore
      ? getPercent(
          store.totalDamage / moves,
          firstStore.totalDamage / firstMoves
        )
      : " - %";

    return (
      <span className="tabLabel" onKeyDown={e => e.stopPropagation()}>
        <div>
          {configStore.isCustomMode ? (
            <RenameableTitle
              isEditing={isEditing}
              value={name}
              onChange={onRename}
              onStartEdit={() => setIsEditing(true)}
              onEndEdit={() => setIsEditing(false)}
              displaySuffix={
                <>
                  {level !== undefined && moveLevel !== undefined && (
                    <span className="tabLabel-title-levels">
                      {` (${level}) ${formatMoveLevel(moveLevel)} EXR`}
                    </span>
                  )}
                  <span className="tabLabel-percent">[{percent}]</span>
                </>
              }
            />
          ) : (
            <Tooltip
              title={`${name} (${level}) ${formatMoveLevel(moveLevel)} EXR`}
            >
              <div className="tabLabel-title">
                <div className="tabLabel-title-name">{name || "Untitled"}</div>
                {level !== undefined && moveLevel !== undefined && (
                  <span className="tabLabel-title-levels">
                    {` (${level}) ${formatMoveLevel(moveLevel)} EXR`}
                  </span>
                )}
                <span className="tabLabel-percent">[{percent}]</span>
              </div>
            </Tooltip>
          )}
        </div>
      </span>
    );
  }
);
