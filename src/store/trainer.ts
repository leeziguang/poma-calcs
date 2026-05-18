import { action, makeObservable, observable } from "mobx";
import { fetchTrainerName } from "src/service";

export class TrainerStore {
  trainers: Record<string, string> = {};
  constructor() {
    makeObservable(this, {
      trainers: observable,
      setTrainers: action
    });
  }

  setTrainers(trainers: Record<string, string>) {
    this.trainers = { ...this.trainers, ...trainers };
  }

  getTrainers() {
    return fetchTrainerName().then(data => {
      this.setTrainers(data);
      console.log(data);
    });
  }

  get trainerOptList() {
    return Object.entries(this.trainers).map(([key, name]) => ({
      value: key,
      label: name
    }));
  }
}

export const trainerStore = new TrainerStore();
