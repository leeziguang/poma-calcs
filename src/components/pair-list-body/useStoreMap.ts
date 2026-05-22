import React, { useCallback, useRef } from "react";
import { PairStore } from "src/store/pair";

export function useStoreMap() {
  const storesRef = useRef<Map<React.Key, PairStore>>(new Map());

  const getOrCreateStore = useCallback((key: React.Key): PairStore => {
    if (!storesRef.current.has(key)) {
      const store = new PairStore();
      store.init();
      storesRef.current.set(key, store);
    }
    return storesRef.current.get(key) as PairStore;
  }, []);

  return { storesRef, getOrCreateStore };
}
