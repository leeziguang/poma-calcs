import { IMoveInfo } from "./pair";

export interface ISavedSession {
  version: 1;
  name: string;
  savedAt: string;
  config: { enemyDef: number; isCustomMode: boolean };
  formValues: Record<string, unknown>;
  pairNames: string[];
  activeKey: string | undefined;
  pairStores: Record<string, Record<string, IMoveInfo>>;
}
