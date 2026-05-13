import { pairStore } from "src/store/pair";

export const calcPairTotalDamage = () => {
  return (
    Object.values(pairStore.moveDamageRec || {}).reduce(
      (acc, moveInfo) => acc + (moveInfo.finalDamage ?? 0),
      0
    ) || "-"
  );
};
