import { action, computed, makeObservable, observable } from "mobx";
import { EMonsterFields, IMonster } from "src/types/monster";
import { IMoveInfo } from "src/types/pair";
import { ETrainerFields } from "src/types/trainer";
import { monsterStore } from "./monster";
import { trainerStore } from "./trainer";

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
