import React from "react";
import { observer } from "mobx-react";
import { Form } from "antd";
import { numberToDisplayString } from "src/lib/helpers";
import { usePairStore } from "src/store/pair-context";
import { EPairListFormFields } from "src/types";

export const TotalDamageDisplay = observer(
  ({ pairFieldName }: { pairFieldName: number }) => {
    const pairStore = usePairStore();
    const form = Form.useFormInstance();
    const moves: number =
      Form.useWatch(
        [EPairListFormFields.PAIR, pairFieldName, EPairListFormFields.MOVES],
        form
      ) ?? 1;
    const perMove = moves > 0 ? pairStore?.totalDamage / moves : 0;
    // const totalDmgString = numberToDisplayString(pairStore?.totalDamage, 6);
    const perMoveString = numberToDisplayString(perMove, 6);

    return (
      <div className="dataColList-pair-damage" title={perMoveString}>
        <span className="dataColList-pair-damage-label">Total Pair Damage</span>
        {perMoveString}
      </div>
    );
  }
);
