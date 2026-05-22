import React from "react";
import { observer } from "mobx-react";
import { numberToDisplayString } from "src/lib/helpers";
import { usePairStore } from "src/store/pair-context";

export const TotalDamageDisplay = observer(({ moves }: { moves: number }) => {
  const pairStore = usePairStore();
  const perMove = moves > 0 ? pairStore?.totalDamage / moves : 0;
  // const totalDmgString = numberToDisplayString(pairStore?.totalDamage, 6);
  const perMoveString = numberToDisplayString(perMove, 6);

  return (
    <div className="dataColList-pair-damage" title={perMoveString}>
      <span className="dataColList-pair-damage-label">Total Pair Damage</span>
      {perMoveString}
    </div>
  );
});
