import { action, computed, makeObservable, observable } from "mobx";
import {
  fetchMonster,
  fetchMonsterBase,
  fetchMonsterNamesEn
} from "src/service/monster";
import {
  EMonsterBaseFields,
  EMonsterFields,
  IMonster,
  IMonsterBase
} from "src/types/monster";

export class MonsterStore {
  monsters: IMonster[] = [];
  monsterBase: IMonsterBase[] = [];
  monsterNamesEn: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      monsters: observable,
      monsterBase: observable,
      monsterNamesEn: observable,
      setMonsters: action,
      setMonsterBase: action,
      setMonsterNamesEn: action,
      monsterMapById: computed
    });
  }

  setMonsters(monsters: IMonster[]) {
    this.monsters = monsters;
  }

  setMonsterBase(monsterBase: IMonsterBase[]) {
    this.monsterBase = monsterBase;
  }

  setMonsterNamesEn(names: Record<string, string>) {
    this.monsterNamesEn = names;
  }

  get monsterMapById(): Record<
    string,
    { monsterName: string; monsterBaseId: number }
  > {
    const map: Record<
      string,
      { monsterName: string; monsterBaseId: number }
    > = {};
    for (const monster of this.monsters) {
      const monsterId = String(monster[EMonsterFields.MONSTER_ID]);
      const monsterBase = this.monsterBase.find(
        mB =>
          mB[EMonsterBaseFields.MONSTER_BASE_ID] ===
          monster[EMonsterFields.MONSTER_BASE_ID]
      );
      const monsterName = this.monsterNamesEn[
        String(monsterBase?.[EMonsterBaseFields.MONSTER_NAME_ID])
      ];
      if (monsterBase && monsterName) {
        map[monsterId] = {
          monsterName,
          monsterBaseId: monsterBase[EMonsterBaseFields.MONSTER_BASE_ID]
        };
      }
    }
    return map;
  }

  getMonsters() {
    return fetchMonster().then(data => {
      this.setMonsters(data.entries);
    });
  }

  getMonsterBase() {
    return fetchMonsterBase().then(data => {
      this.setMonsterBase(data.entries);
    });
  }

  getMonsterNamesEn() {
    return fetchMonsterNamesEn().then(data => {
      this.setMonsterNamesEn(data);
    });
  }

  initApiCalls() {
    this.getMonsters();
    this.getMonsterBase();
    this.getMonsterNamesEn();
  }

  reset() {
    this.monsters = [];
    this.monsterBase = [];
    this.monsterNamesEn = {};
  }
}

export const monsterStore = new MonsterStore();
