import { action, makeObservable, observable } from "mobx";
import { fetchMove, fetchMoveNamesEn } from "src/service/move";
import { IMove } from "src/types/move";

export class MoveStore {
  moves: IMove[] = [];
  moveNamesEn: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      moves: observable,
      moveNamesEn: observable,
      setMoves: action,
      setMoveNamesEn: action
    });
  }

  setMoves(moves: IMove[]) {
    this.moves = moves;
  }

  setMoveNamesEn(names: Record<string, string>) {
    this.moveNamesEn = names;
  }

  getMoves() {
    return fetchMove().then(data => {
      this.setMoves(data.entries);
    });
  }

  getMoveNamesEn() {
    return fetchMoveNamesEn().then(data => {
      this.setMoveNamesEn(data);
    });
  }

  initApiCalls() {
    return Promise.all([this.getMoves(), this.getMoveNamesEn()]);
  }

  reset() {
    this.moves = [];
    this.moveNamesEn = {};
  }
}

export const moveStore = new MoveStore();
