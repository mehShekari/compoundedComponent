import {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  isValidElement,
} from "react";

type ComponentWithDisplayName = {
  displayName?: string;
};

export function getComponentDisplayName(type: unknown): string | undefined {
  if (typeof type === "function" || (typeof type === "object" && type !== null)) {
    return (type as ComponentWithDisplayName).displayName;
  }
  return undefined;
}

function flattenValidElements(children: ReactNode): ReactElement[] {
  const elements: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Fragment) {
      elements.push(...flattenValidElements(child.props.children));
      return;
    }

    elements.push(child);
  });

  return elements;
}

export type UseFilterNodeChildrenParams = {
  children: ReactNode;
  checkDisplayName: string;
  defaultsDisplayNames: string[];
  defaultComponents: ReactNode[];
};

export type FilterNodeChildrenResult = {
  finalChildren: ReactNode;
  customChildren: ReactElement[];
  hasAllSlots: boolean;
};

export function resolveCompoundSlots({
  children,
  checkDisplayName,
  defaultsDisplayNames,
  defaultComponents,
}: UseFilterNodeChildrenParams): FilterNodeChildrenResult {
  const childArray = flattenValidElements(children);

  const matchedSlots = childArray.filter((child) => {
    const displayName = getComponentDisplayName(child.type);
    return displayName?.startsWith(checkDisplayName) ?? false;
  });

  const customChildren = childArray.filter(
    (child) => !getComponentDisplayName(child.type),
  );

  const hasAllSlots = defaultsDisplayNames.every((slot) =>
    matchedSlots.some(
      (child) => getComponentDisplayName(child.type) === `${checkDisplayName}${slot}`,
    ),
  );

  if (hasAllSlots) {
    return { finalChildren: children, customChildren, hasAllSlots: true };
  }

  const slotMap = new Map<string, ReactElement>();
  matchedSlots.forEach((node) => {
    const displayName = getComponentDisplayName(node.type);
    if (!displayName) return;

    defaultsDisplayNames.forEach((slot) => {
      if (displayName === `${checkDisplayName}${slot}`) {
        slotMap.set(slot, node);
      }
    });
  });

  const finalChildren = defaultsDisplayNames.map(
    (slot, index) => slotMap.get(slot) ?? (defaultComponents[index] as ReactElement),
  );

  return { finalChildren, customChildren, hasAllSlots: false };
}
