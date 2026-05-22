import uniqBy from "lodash/uniqBy";
import { useRef, useCallback } from "react";
import { monsterStore } from "src/store/monster";
import { PairStore } from "src/store/pair";
import { trainerStore } from "src/store/trainer";

export function genTrainerOptionList() {
  const monsterMap = monsterStore.monsterMapById;

  trainerStore.setTrainerOptionsList(
    uniqBy(
      Object.values(trainerStore.trainerInfoMap || {}).map(
        ({ trainerName, trainerId, monsterId }) => {
          const monsterInfo = monsterMap[monsterId];
          return {
            label: `${trainerName} & ${monsterInfo?.monsterName}`,
            value: `${trainerName} & ${monsterInfo?.monsterName}`,
            trainerId,
            monsterId,
            monsterBaseId: monsterInfo?.monsterBaseId
          };
        }
      ),
      "label"
    )
  );
}

export function useStoreMap() {
  const storesRef = useRef<Map<React.Key, PairStore>>(new Map());

  const getOrCreateStore = useCallback((key: React.Key): PairStore => {
    if (!storesRef.current.has(key)) {
      const store = new PairStore();
      store.init();
      storesRef.current.set(key, store);
    }
    return storesRef.current.get(key) as PairStore;
  }, []);

  return { storesRef, getOrCreateStore };
}
