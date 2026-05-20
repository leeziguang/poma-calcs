import { action, computed, makeObservable, observable } from "mobx";
import { IMoveInfo } from "src/types/pair";

export class PairStore {
  moveDamageRec: Record<string, IMoveInfo> = {};

  constructor() {
    makeObservable(this, {
      moveDamageRec: observable,
      updateMoveInfo: action,
      totalDamage: computed
    });
  }

  updateMoveInfo(key: string, moveInfo: IMoveInfo) {
    const merged = { ...this.moveDamageRec?.[key], ...moveInfo };
    merged.finalDamage =
      (merged.baseStat ?? 0) *
      (merged.movePower ?? 0) *
      (merged.fieldEffect ?? 0);

    this.moveDamageRec = { ...this.moveDamageRec, [key]: merged };
  }

  get totalDamage() {
    return Object.values(this.moveDamageRec || {}).reduce(
      (acc, moveInfo) => acc + (moveInfo.finalDamage ?? 0),
      0
    );
  }

  init() {
    this.moveDamageRec = {};
  }
}
