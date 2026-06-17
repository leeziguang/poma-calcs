import React from "react";
import { observer } from "mobx-react";
import { Card } from "antd";
import { numberToDisplayString, getPercent } from "src/lib/helpers";
import { usePairStore } from "src/store/pair-context";

export const MoveDamageDisplay = observer(
  ({ moveColName }: { moveColName: string }) => {
    const pairStore = usePairStore();
    const moveDamageString = numberToDisplayString(
      pairStore.moveDamageRec?.[moveColName]?.finalDamage || 0,
      6
    );

    const percentString = getPercent(
      pairStore.moveDamageRec?.[moveColName]?.finalDamage || 0,
      pairStore.totalDamage
    );

    return (
      <Card className="dataColList-move-damage">
        <b>Move Damage</b>
        <div className="dataColList-move-damage-values">
          <div
            title={moveDamageString}
            className="dataColList-move-damage-values-raw"
          >
            {moveDamageString}
          </div>
          <div
            title={percentString}
            className="dataColList-move-damage-values-percent"
          >
            ({percentString})
          </div>
        </div>
      </Card>
    );
  }
);
