import { createContext, useContext } from "react";
import { PairStore } from "./pair";

export const PairStoreContext = createContext<PairStore>({} as PairStore);
export const usePairStore = () => useContext(PairStoreContext);
