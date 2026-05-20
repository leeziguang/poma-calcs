import { monsterStore } from "src/store/monster";
import { trainerStore } from "src/store/trainer";

export function genTrainerOptionList() {
  const monsterMap = monsterStore.monsterMapById;

  trainerStore.setTrainerOptionsList(
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
    )
  );
}
