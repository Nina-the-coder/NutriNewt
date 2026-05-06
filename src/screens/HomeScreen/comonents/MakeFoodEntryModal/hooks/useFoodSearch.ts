import { useMemo, useState, useEffect } from "react";
import {
  preprocessInventory,
  searchInventory,
} from "../../../../../utils/searchUtil";

export default function useFoodSearch(inventory: any[]) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);

    return () => clearTimeout(t);
  }, [search]);

  const processedInventory = useMemo(() => {
    return preprocessInventory(inventory);
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return processedInventory;
    }

    return searchInventory(processedInventory, debouncedSearch).slice(0, 50);
  }, [debouncedSearch, processedInventory]);

  return {
    search,
    setSearch,
    filteredInventory,
  };
}
