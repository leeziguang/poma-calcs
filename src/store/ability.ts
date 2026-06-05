import { action, computed, makeObservable, observable } from "mobx";
import { fetchAbilities, fetchAbilityPanels } from "src/service/ability";
import { IAbility, IAbilityPanel } from "src/types/ability";
import { trainerStore } from "src/store/trainer";

export class AbilityStore {
  abilities: IAbility[] = [];
  abilityPanels: IAbilityPanel[] = [];

  constructor() {
    makeObservable(this, {
      abilities: observable,
      abilityPanels: observable,
      setAbilities: action,
      setAbilityPanels: action,
      abilityMap: computed,
      selectedAbilityCells: computed
    });
  }

  setAbilities(entries: IAbility[]) {
    this.abilities = entries;
  }

  setAbilityPanels(entries: IAbilityPanel[]) {
    this.abilityPanels = entries;
  }

  get abilityMap(): Record<number, IAbility> {
    return this.abilities.reduce<Record<number, IAbility>>((acc, a) => {
      acc[a.abilityId] = a;
      return acc;
    }, {});
  }

  // todo: shift this into a helper, do not recommend inter-store dependency
  get selectedAbilityCells(): IAbilityPanel[] {
    const trainerId = trainerStore.selectedTrainerId;
    return this.abilityPanels.filter(p => String(p.trainerId) === trainerId);
  }

  getAbilities() {
    return fetchAbilities().then(data => {
      this.setAbilities(data.entries);
    });
  }

  getAbilityPanels() {
    return fetchAbilityPanels().then(data => {
      this.setAbilityPanels(data.entries);
    });
  }

  initApiCalls() {
    return Promise.all([this.getAbilities(), this.getAbilityPanels()]);
  }
}

export const abilityStore = new AbilityStore();
