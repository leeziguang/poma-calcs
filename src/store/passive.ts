import { action, computed, makeObservable, observable } from "mobx";
import {
  fetchPassiveSkillNamesEn,
  fetchPassiveSkillNamePartsEn,
  fetchPassiveSkillDescriptionEn,
  fetchPassiveSkillDescriptionPartsEn,
  fetchPassiveSkillChild,
  fetchMoveAndPassiveSkillDigit
} from "src/service/passive";
import {
  IPassiveSkillChild,
  IMoveAndPassiveSkillDigit
} from "src/types/passive";

export class PassiveStore {
  passiveSkillNamesEn: Record<string, string> = {};
  passiveSkillNamePartsEn: Record<string, string> = {};
  passiveSkillDescriptionEn: Record<string, string> = {};
  passiveSkillDescriptionPartsEn: Record<string, string> = {};
  passiveSkillChildren: IPassiveSkillChild[] = [];
  moveAndPassiveSkillDigits: IMoveAndPassiveSkillDigit[] = [];

  constructor() {
    makeObservable(this, {
      passiveSkillNamesEn: observable,
      passiveSkillNamePartsEn: observable,
      passiveSkillDescriptionEn: observable,
      passiveSkillDescriptionPartsEn: observable,
      passiveSkillChildren: observable,
      moveAndPassiveSkillDigits: observable,
      setPassiveSkillNamesEn: action,
      setPassiveSkillNamePartsEn: action,
      setPassiveSkillDescriptionEn: action,
      setPassiveSkillDescriptionPartsEn: action,
      setPassiveSkillChildren: action,
      setMoveAndPassiveSkillDigits: action,
      moveAndPassiveSkillDigitMap: computed
    });
  }

  get moveAndPassiveSkillDigitMap(): Record<string, IMoveAndPassiveSkillDigit> {
    return this.moveAndPassiveSkillDigits.reduce<
      Record<string, IMoveAndPassiveSkillDigit>
    >((acc, d) => {
      acc[d.id] = d;
      return acc;
    }, {});
  }

  setPassiveSkillNamesEn(names: Record<string, string>) {
    this.passiveSkillNamesEn = names;
  }

  setPassiveSkillNamePartsEn(parts: Record<string, string>) {
    this.passiveSkillNamePartsEn = parts;
  }

  setPassiveSkillDescriptionEn(desc: Record<string, string>) {
    this.passiveSkillDescriptionEn = desc;
  }

  setPassiveSkillDescriptionPartsEn(parts: Record<string, string>) {
    this.passiveSkillDescriptionPartsEn = parts;
  }

  setPassiveSkillChildren(children: IPassiveSkillChild[]) {
    this.passiveSkillChildren = children;
  }

  setMoveAndPassiveSkillDigits(digits: IMoveAndPassiveSkillDigit[]) {
    this.moveAndPassiveSkillDigits = digits;
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

  getPassiveSkillDescriptionEn() {
    return fetchPassiveSkillDescriptionEn().then(data => {
      this.setPassiveSkillDescriptionEn(data);
    });
  }

  getPassiveSkillDescriptionPartsEn() {
    return fetchPassiveSkillDescriptionPartsEn().then(data => {
      this.setPassiveSkillDescriptionPartsEn(data);
    });
  }

  getPassiveSkillChildren() {
    return fetchPassiveSkillChild().then(data => {
      this.setPassiveSkillChildren(data.entries);
    });
  }

  getMoveAndPassiveSkillDigits() {
    return fetchMoveAndPassiveSkillDigit().then(data => {
      this.setMoveAndPassiveSkillDigits(data.entries);
    });
  }

  initApiCalls() {
    return Promise.all([
      this.getPassiveSkillNamesEn(),
      this.getPassiveSkillNamePartsEn(),
      this.getPassiveSkillDescriptionEn(),
      this.getPassiveSkillDescriptionPartsEn(),
      this.getPassiveSkillChildren(),
      this.getMoveAndPassiveSkillDigits()
    ]);
  }

  reset() {
    this.passiveSkillNamesEn = {};
    this.passiveSkillNamePartsEn = {};
    this.passiveSkillDescriptionEn = {};
    this.passiveSkillDescriptionPartsEn = {};
    this.passiveSkillChildren = [];
    this.moveAndPassiveSkillDigits = [];
  }
}

export const passiveStore = new PassiveStore();
