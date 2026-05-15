import { createContext, useContext } from "react";
import { PairStore, pairStore } from "./pair";

export const PairStoreContext = createContext<PairStore>(pairStore);
export const usePairStore = () => useContext(PairStoreContext);
