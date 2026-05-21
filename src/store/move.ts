import { action, computed, makeObservable, observable } from "mobx";
import {
  fetchMove,
  fetchMoveDescriptionEn,
  fetchMoveDescriptionPartsEn,
  fetchMoveNamesEn
} from "src/service/move";
import { EMoveFields, IMove } from "src/types/move";

export class MoveStore {
  moves: IMove[] = [];
  moveNamesEn: Record<string, string> = {};
  moveDescriptionEn: Record<string, string> = {};
  moveDescriptionPartsEn: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      moves: observable,
      moveNamesEn: observable,
      moveDescriptionEn: observable,
      moveDescriptionPartsEn: observable,
      setMoves: action,
      setMoveNamesEn: action,
      setMoveDescriptionEn: action,
      setMoveDescriptionPartsEn: action,
      moveMap: computed,
      moveDescriptionMap: computed
    });
  }

  setMoves(moves: IMove[]) {
    this.moves = moves;
  }

  setMoveNamesEn(names: Record<string, string>) {
    this.moveNamesEn = names;
  }

  setMoveDescriptionEn(descriptions: Record<string, string>) {
    this.moveDescriptionEn = descriptions;
  }

  setMoveDescriptionPartsEn(parts: Record<string, string>) {
    this.moveDescriptionPartsEn = parts;
  }

  get moveDescriptionMap(): Record<string, Record<string, string>> {
    const map: Record<string, Record<string, string>> = {};
    for (const [moveId, raw] of Object.entries(this.moveDescriptionEn)) {
      const parts: Record<string, string> = {};
      const re = /Idx="(\d+)"/g;
      let match: RegExpExecArray | null;
      while ((match = re.exec(raw)) !== null) {
        const partId = match[1];
        if (this.moveDescriptionPartsEn[partId] !== undefined) {
          parts[partId] = this.moveDescriptionPartsEn[partId];
        }
      }
      map[moveId] = parts;
    }

    return map;
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

  getMoveDescriptionEn() {
    return fetchMoveDescriptionEn().then(data => {
      this.setMoveDescriptionEn(data);
    });
  }

  getMoveDescriptionPartsEn() {
    return fetchMoveDescriptionPartsEn().then(data => {
      this.setMoveDescriptionPartsEn(data);
    });
  }

  initApiCalls() {
    return Promise.all([
      this.getMoves(),
      this.getMoveNamesEn(),
      this.getMoveDescriptionEn(),
      this.getMoveDescriptionPartsEn()
    ]);
  }

  reset() {
    this.moves = [];
    this.moveNamesEn = {};
    this.moveDescriptionEn = {};
    this.moveDescriptionPartsEn = {};
  }
}

export const moveStore = new MoveStore();
