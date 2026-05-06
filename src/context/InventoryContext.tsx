import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { InventoryItem, Unit } from "../types/models";
import { saveData, getData } from "../utils/storage";
import { defaultInventory } from "../data/defaultInventory";

const STORAGE_KEY = "FUELUP_INVENTORY";

const InventoryContext = createContext<any>(null);

export const InventoryProvider = ({ children }: any) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* 🔹 LOAD */
  useEffect(() => {
    const load = async () => {
      const stored = await getData(STORAGE_KEY);

      if (stored && stored.length > 0) {
        setInventory(stored);
      } else {
        // fallback to default inventory
        const items = defaultInventory.map((item) => ({
          ...item,
          unit: item.unit as Unit,
        }));
        setInventory(items);
      }

      setIsLoaded(true);
    };

    load();
  }, []);

  /* 🔹 SAVE */
  useEffect(() => {
    if (!isLoaded) return;
    saveData(STORAGE_KEY, inventory);
  }, [inventory, isLoaded]);

  /* 🔹 ACTIONS */
  const addInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => [...prev, item]);
  };

  const removeInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const toggleFavorite = (id: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  const value = useMemo(
    () => ({
      inventory,
      addInventoryItem,
      removeInventoryItem,
      updateInventoryItem,
      toggleFavorite,
    }),
    [inventory]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);