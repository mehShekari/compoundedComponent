import { createContext, useContext } from "react";
import type { TableDataContextValue } from "../../../types/page.types";

export const TableDataContext = createContext<TableDataContextValue | null>(null);

export function useTableData(): TableDataContextValue {
  const context = useContext(TableDataContext);
  if (!context) {
    throw new Error("useTableData must be used within TableDataContext.Provider");
  }
  return context;
}
