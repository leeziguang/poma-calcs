import { IMoveInfo } from "./pair";
import { IPairPassiveState } from "./passive";

export interface ISavedSession {
  version: 1;
  name: string;
  savedAt: string;
  config: { enemyDef: number; isCustomMode: boolean };
  formValues: Record<string, unknown>;
  pairNames: string[];
  activeKey: string | undefined;
  pairStores: Record<string, Record<string, IMoveInfo>>;
  passiveStates?: Record<string, IPairPassiveState>;
  gridCellIds?: Record<string, number[]>;
}
