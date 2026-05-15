import React from "react";
import { observer } from "mobx-react";
import { numberToDisplayString } from "src/lib/helpers";
import { pairStore } from "src/store/pair";

export const TotalDamageDisplay = observer(() => {
  const totalDmgString = numberToDisplayString(pairStore?.totalDamage, 6);

  return (
    <div className="dataColList-pair-damage" title={totalDmgString}>
      <span className="dataColList-pair-damage-label">Total Pair Damage</span>
      {totalDmgString}
    </div>
  );
});
