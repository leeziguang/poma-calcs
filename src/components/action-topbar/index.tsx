import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { InputNumber, Input, Button } from "antd";
import { configStore } from "src/store/config";

interface IActionTopbarProps {
  add: () => void;
  setPairName: (name: string | undefined) => void;
  pairName: string | undefined;
  setPairNames: (updater: (prev: string[]) => string[]) => void;
}

export const ActionTopbar = observer(
  ({ add, setPairName, pairName, setPairNames }: IActionTopbarProps) => {
    useEffect(() => {
      configStore.init();
    }, []);

    return (
      <div className="pairList-actions-row-wrapper">
        <div className="pairList-actions-row-wrapper-delete-wrapper">
          Enemy Def
          <InputNumber
            value={configStore.enemyDef}
            onChange={(val: number) => configStore.setEnemyDef(val)}
            placeholder="Enemy Def"
            controls={false}
            min={0}
          />
        </div>
        <div className="pairList-actions-row-wrapper-add-wrapper">
          <Input
            value={pairName}
            onChange={e => setPairName(e.target.value)}
            placeholder="Name of pair to add"
          />
          <Button
            onClick={() => {
              add();
              setPairNames(prev => [...prev, pairName]);
              setPairName(undefined);
            }}
          >
            Add Pair
          </Button>
        </div>
      </div>
    );
  }
);
