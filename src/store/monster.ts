import { action, computed, makeObservable, observable } from "mobx";
import {
  fetchMonster,
  fetchMonsterBase,
  fetchMonsterNamesEn,
  fetchMonsterVariation
} from "src/service/monster";
import {
  EMonsterBaseFields,
  EMonsterFields,
  EMonsterVariationFields,
  IMonster,
  IMonsterBase,
  IMonsterMapVal,
  IMonsterVariation
} from "src/types/monster";

export class MonsterStore {
  monsters: IMonster[] = [];
  monsterBase: IMonsterBase[] = [];
  monsterNamesEn: Record<string, string> = {};
  monsterVariations: IMonsterVariation[] = [];
  selectedMonsterBaseId = "";

  constructor() {
    makeObservable(this, {
      monsters: observable,
      monsterBase: observable,
      monsterNamesEn: observable,
      monsterVariations: observable,
      selectedMonsterBaseId: observable,
      setMonsters: action,
      setMonsterBase: action,
      setMonsterNamesEn: action,
      setMonsterVariations: action,
      setSelectedMonsterBaseId: action,
      monsterMapById: computed,
      selectedMonsterVariation: computed
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

  setMonsterVariations(monsterVariations: IMonsterVariation[]) {
    this.monsterVariations = monsterVariations;
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
          monsterId: monster[EMonsterFields.MONSTER_ID],
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

  get selectedMonsterVariation() {
    return this.monsterVariations.find(
      v => v[EMonsterVariationFields.MONSTER_ID] === this.selectedMonsterBaseId
    );
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

  getMonsterVariations() {
    return fetchMonsterVariation().then(data => {
      this.setMonsterVariations(data.entries);
    });
  }

  initApiCalls() {
    return Promise.all([
      this.getMonsters(),
      this.getMonsterBase(),
      this.getMonsterNamesEn(),
      this.getMonsterVariations()
    ]);
  }

  reset() {
    this.monsters = [];
    this.monsterBase = [];
    this.monsterNamesEn = {};
    this.monsterVariations = [];
  }
}

export const monsterStore = new MonsterStore();
