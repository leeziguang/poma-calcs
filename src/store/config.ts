import { makeObservable, observable, action } from "mobx";

export class ConfigStore {
  enemyDef: number;

  constructor() {
    makeObservable(this, {
      enemyDef: observable,
      setEnemyDef: action
    });
  }

  setEnemyDef(def: number) {
    this.enemyDef = def;
  }

  init() {
    this.setEnemyDef(50);
  }
}

export const configStore = new ConfigStore();
