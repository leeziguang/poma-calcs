import { action, computed, makeObservable, observable } from "mobx";
import { fetchMove, fetchMoveNamesEn } from "src/service/move";
import { EMoveFields, IMove } from "src/types/move";

export class MoveStore {
  moves: IMove[] = [];
  moveNamesEn: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      moves: observable,
      moveNamesEn: observable,
      setMoves: action,
      setMoveNamesEn: action,
      moveMap: computed
    });
  }

  setMoves(moves: IMove[]) {
    this.moves = moves;
  }

  setMoveNamesEn(names: Record<string, string>) {
    this.moveNamesEn = names;
  }

  get moveMap(): Record<string, IMove> {
    const map: Record<string, IMove> = {};
    for (const move of this.moves) {
      map[String(move[EMoveFields.MOVE_ID])] = move;
    }
    return map;
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
