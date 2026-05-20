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
  IMonsterBase,
  IMonsterMapVal
} from "src/types/monster";

export class MonsterStore {
  monsters: IMonster[] = [];
  monsterBase: IMonsterBase[] = [];
  monsterNamesEn: Record<string, string> = {};
  selectedMonsterBaseId = "";

  constructor() {
    makeObservable(this, {
      monsters: observable,
      monsterBase: observable,
      monsterNamesEn: observable,
      selectedMonsterBaseId: observable,
      setMonsters: action,
      setMonsterBase: action,
      setMonsterNamesEn: action,
      setSelectedMonsterBaseId: action,
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

  setSelectedMonsterBaseId(monsterId: string) {
    this.selectedMonsterBaseId = monsterId;
  }

  get monsterMapById(): Record<string, IMonsterMapVal> {
    const map: Record<string, IMonsterMapVal> = {};

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
          monsterBaseId: monsterBase[EMonsterBaseFields.MONSTER_BASE_ID],
          atkValues: monster[EMonsterFields.ATK_VALUES].slice(-2),
          spaValues: monster[EMonsterFields.SPA_VALUES].slice(-2),
          syncMoveId: monster[EMonsterFields.SYNC_MOVE_ID]
        };
      }
    }

    return map;
  }

  get selectedMonster() {
    return this.monsterMapById[this.selectedMonsterBaseId];
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
    return Promise.all([
      this.getMonsters(),
      this.getMonsterBase(),
      this.getMonsterNamesEn()
    ]);
  }

  reset() {
    this.monsters = [];
    this.monsterBase = [];
    this.monsterNamesEn = {};
  }
}

export const monsterStore = new MonsterStore();
