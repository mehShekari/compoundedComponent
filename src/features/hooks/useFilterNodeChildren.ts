import { useEffect, useMemo } from "react";

import {
  resolveCompoundSlots,
  type FilterNodeChildrenResult,
  type UseFilterNodeChildrenParams,
} from "./resolveCompoundSlots";

export type { FilterNodeChildrenResult, UseFilterNodeChildrenParams };
export { getComponentDisplayName, resolveCompoundSlots } from "./resolveCompoundSlots";

export default function useFilterNodeChildren(
  params: UseFilterNodeChildrenParams,
): Omit<FilterNodeChildrenResult, "hasAllSlots"> {
  const { finalChildren, customChildren, hasAllSlots } = useMemo(
    () => resolveCompoundSlots(params),
    [params.children, params.checkDisplayName, params.defaultsDisplayNames, params.defaultComponents],
  );

  useEffect(() => {
    if (customChildren.length > 0 && !hasAllSlots) {
      console.warn(
        "To render custom elements inside a compound section, provide all default slot components to the parent.",
      );
    }
  }, [customChildren.length, hasAllSlots]);

  return { finalChildren, customChildren };
}
