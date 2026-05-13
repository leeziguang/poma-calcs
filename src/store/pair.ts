import { action, makeObservable, observable } from "mobx";
import { IMoveInfo } from "src/types/pair";

export class PairStore {
  moveDamageRec: Record<string, IMoveInfo>;

  constructor() {
    makeObservable(this, {
      moveDamageRec: observable,
      updateMoveInfo: action
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

  init() {
    this.moveDamageRec = {};
  }
}

export const pairStore = new PairStore();
