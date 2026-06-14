import { createContext, useContext } from "react";
import type { PageCompoundContextValue } from "../../types/page.types";

export const PageCompoundContext = createContext<PageCompoundContextValue | null>(null);

export function usePageCompoundContext(): PageCompoundContextValue {
  const context = useContext(PageCompoundContext);
  if (!context) {
    throw new Error("usePageCompoundContext must be used within PageCompound");
  }
  return context;
}
