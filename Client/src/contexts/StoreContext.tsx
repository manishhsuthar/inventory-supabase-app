import React, { createContext, useContext } from "react";
import { useInventoryStore } from "@/hooks/useInventoryStore";

type StoreType = ReturnType<typeof useInventoryStore>;
const StoreContext = createContext<StoreType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useInventoryStore();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be within StoreProvider");
  return ctx;
};
