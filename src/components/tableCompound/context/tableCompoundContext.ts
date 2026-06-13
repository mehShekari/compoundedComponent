import { createContext, useContext } from "react";
import type { TableCompoundContextValue } from "../../../types/table.types";

export const TableCompoundContext = createContext<TableCompoundContextValue | null>(null);

export function useTableCompoundContext(): TableCompoundContextValue {
  const context = useContext(TableCompoundContext);
  if (!context) {
    throw new Error("useTableCompoundContext must be used within TableCompound");
  }
  return context;
}
