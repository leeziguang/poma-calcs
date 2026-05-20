import { action, computed, makeObservable, observable } from "mobx";
import { SCRAPPED_MON_ID_PREFIX, MC_BASE_ID } from "src/container/constants";
import {
  fetchTrainer,
  fetchTrainerBase,
  fetchTrainerNamesEn,
  fetchVerboseTrainerNamesEn
} from "src/service/trainer";
import {
  ETrainerFields,
  ETrainerKind,
  ITrainer,
  ITrainerBasePicked,
  ITrainerInfoListVal
} from "src/types/trainer";

export interface ITrainerOption {
  label: string;
  value: string;
  trainerId: string;
  monsterId: string;
  monsterBaseId: number | undefined;
}

export class TrainerStore {
  trainers: ITrainer[] = [];
  trainerBase: ITrainerBasePicked[] = [];
  trainerNamesEn: Record<string, string> = {};
  verboseTrainerNamesEn: Record<string, string> = {};
  trainerOptionsList: ITrainerOption[] = [];
  selectedTrainerId = "";

  constructor() {
    makeObservable(this, {
      trainers: observable,
      trainerBase: observable,
      trainerNamesEn: observable,
      verboseTrainerNamesEn: observable,
      trainerOptionsList: observable,
      selectedTrainerId: observable,
      setTrainers: action,
      setTrainerBase: action,
      setTrainerNamesEn: action,
      setVerboseTrainerNamesEn: action,
      setTrainerOptionsList: action,
      setSelectedTrainerId: action,
      trainerInfoMap: computed,
      selectedTrainer: computed
    });
  }

  setTrainers(trainers: ITrainer[]) {
    this.trainers = trainers;
  }

  setTrainerBase(trainerBase: ITrainerBasePicked[]) {
    this.trainerBase = trainerBase;
  }

  setTrainerNamesEn(names: Record<string, string>) {
    this.trainerNamesEn = names;
  }

  setVerboseTrainerNamesEn(names: Record<string, string>) {
    this.verboseTrainerNamesEn = names;
  }

  setTrainerOptionsList(options: ITrainerOption[]) {
    this.trainerOptionsList = options;
  }

  setSelectedTrainerId(id: string) {
    this.selectedTrainerId = id;
  }

  getTrainers() {
    return fetchTrainer().then(data => {
      this.setTrainers(data.entries);
    });
  }

  getTrainerBase() {
    return fetchTrainerBase().then(data => {
      this.setTrainerBase(
        data.entries.map(e => ({
          trainerBaseId: e.id,
          trainerNameId: e.trainerNameId
        }))
      );
    });
  }

  getTrainerNamesEn() {
    return fetchTrainerNamesEn().then(data => {
      this.setTrainerNamesEn(data);
    });
  }

  getVerboseTrainerNamesEn() {
    return fetchVerboseTrainerNamesEn().then(data => {
      this.setVerboseTrainerNamesEn(data);
    });
  }

  get trainerInfoMap(): Record<string, ITrainerInfoListVal> {
    const map: Record<string, ITrainerInfoListVal> = {};

    this.trainers
      ?.filter(
        t =>
          t?.[ETrainerFields.TRAINER_KIND] === ETrainerKind.GACHA &&
          t?.[ETrainerFields.RARITY] >= 4 &&
          !t?.[ETrainerFields.MONSTER_ID]?.startsWith(SCRAPPED_MON_ID_PREFIX)
      )
      ?.map(t => {
        const trainerBase = this.trainerBase.find(
          b => b?.trainerBaseId === String(t?.[ETrainerFields.TRAINER_BASE_ID])
        );
        // Prioritize verbose name over base name; fall back to "MC" for eggmon
        const trainerName =
          trainerBase?.trainerBaseId === MC_BASE_ID
            ? "MC"
            : this.verboseTrainerNamesEn[t?.[ETrainerFields.TRAINER_ID]] ||
              this.trainerNamesEn[trainerBase?.trainerNameId as string];

        map[t[ETrainerFields.TRAINER_ID]] = {
          trainerName,
          trainerId: t?.[ETrainerFields.TRAINER_ID],
          move1Id: t?.move1Id,
          move2Id: t?.move2Id,
          move3Id: t?.move3Id,
          move4Id: t?.move4Id,
          monsterId: t?.monsterId
        };
      });

    return map;
  }

  get selectedTrainer() {
    return this.trainerInfoMap[this.selectedTrainerId];
  }

  initApiCalls() {
    return Promise.all([
      this.getTrainers(),
      this.getTrainerBase(),
      this.getTrainerNamesEn(),
      this.getVerboseTrainerNamesEn()
    ]);
  }

  reset() {
    this.trainers = [];
    this.trainerBase = [];
    this.trainerNamesEn = {};
    this.verboseTrainerNamesEn = {};
    this.trainerOptionsList = [];
  }
}

export const trainerStore = new TrainerStore();
