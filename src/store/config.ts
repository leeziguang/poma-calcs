import { makeObservable, observable, action } from "mobx";

export class ConfigStore {
  enemyDef;
  isCustomMode;

  constructor() {
    makeObservable(this, {
      enemyDef: observable,
      setEnemyDef: action,
      isCustomMode: observable,
      setIsCustomMode: action
    });
    this.enemyDef = 50;
    this.isCustomMode = false;
  }

  setEnemyDef(def: number) {
    this.enemyDef = def;
  }

  setIsCustomMode(val: boolean) {
    this.isCustomMode = val;
  }

  reset() {
    this.setEnemyDef(50);
    this.setIsCustomMode(false);
  }
}

export const configStore = new ConfigStore();
