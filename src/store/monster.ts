import { action, makeObservable, observable } from "mobx";
import {
  fetchMonster,
  fetchMonsterBase,
  fetchMonsterNamesEn
} from "src/service/monster";
import { IMonster, IMonsterBase } from "src/types/monster";

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
      setMonsterNamesEn: action
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
