import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { RecentMap } from "../types/models";
import { saveData, getData } from "../utils/storage";

const STORAGE_KEY = "FUELUP_RECENTS";

const RecentsContext = createContext<any>(null);

export const RecentsProvider = ({ children }: any) => {
  const [recents, setRecents] = useState<RecentMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await getData(STORAGE_KEY);
      if (stored) {
        const cleaned: RecentMap = {};
        Object.entries(stored).forEach(([k, v]: any) => {
          if (v && typeof v === "object" && "quantity" in v) {
            cleaned[k] = v;
          }
        });
        setRecents(cleaned);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveData(STORAGE_KEY, recents);
  }, [recents, isLoaded]);

  const value = useMemo(() => ({ recents, setRecents }), [recents]);

  return <RecentsContext.Provider value={value}>{children}</RecentsContext.Provider>;
};

export const useRecents = () => useContext(RecentsContext);