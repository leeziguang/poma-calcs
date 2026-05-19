import { action, makeObservable, observable } from "mobx";
import {
  fetchPassiveSkillNamesEn,
  fetchPassiveSkillNamePartsEn
} from "src/service/passive";

export class PassiveStore {
  passiveSkillNamesEn: Record<string, string> = {};
  passiveSkillNamePartsEn: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      passiveSkillNamesEn: observable,
      passiveSkillNamePartsEn: observable,
      setPassiveSkillNamesEn: action,
      setPassiveSkillNamePartsEn: action
    });
  }

  setPassiveSkillNamesEn(names: Record<string, string>) {
    this.passiveSkillNamesEn = names;
  }

  setPassiveSkillNamePartsEn(parts: Record<string, string>) {
    this.passiveSkillNamePartsEn = parts;
  }

  getPassiveSkillNamesEn() {
    return fetchPassiveSkillNamesEn().then(data => {
      this.setPassiveSkillNamesEn(data);
    });
  }

  getPassiveSkillNamePartsEn() {
    return fetchPassiveSkillNamePartsEn().then(data => {
      this.setPassiveSkillNamePartsEn(data);
    });
  }

  initApiCalls() {
    this.getPassiveSkillNamesEn();
    this.getPassiveSkillNamePartsEn();
  }

  reset() {
    this.passiveSkillNamesEn = {};
    this.passiveSkillNamePartsEn = {};
  }
}

export const passiveStore = new PassiveStore();
