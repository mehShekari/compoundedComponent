import React, { ReactElement, isValidElement, useEffect, useMemo, useRef } from "react";

/**
 * @param children - The child elements to filter.
 * @param checkDisplayName - The display name of the component to check for.
 * @param defaultsDisplayNames - The list of default component display names.
 * @param defaultComponents - The list of default components to use if no matches are found.
 * 
 * @returns An object containing the filtered child elements and any custom components found.
*/

export default function useFilterNodeChildren({
  children,
  checkDisplayName,
  defaultsDisplayNames,
  defaultComponents
}: {
  children: React.ReactNode,
  checkDisplayName: string,
  defaultsDisplayNames: string[],
  defaultComponents: React.ReactNode[]
}) { 
  const defaultComponentsState = useMemo(() => [...defaultComponents], [defaultComponents]);
  const FinalChildren = useRef<ReactElement[]>(Array(defaultComponentsState.length).fill(null));

  const getTableCompoundDefaultComponents = useMemo((): ReactElement[] => {
    return React.Children.toArray(children).filter(_childNode => {
      return isValidElement(_childNode)
        && (_childNode as any).type.displayName && (_childNode as any).type.displayName.includes(checkDisplayName)
    }) as ReactElement[];
  }, [children, checkDisplayName])

  const getCustomChildren = () => {
    return React.Children.toArray(children).filter(_childNode => {
      return isValidElement(_childNode) && !(_childNode as any).type.displayName
    }) as ReactElement[];
  }

  const RenderResult = (_node: any, _index: number) => {
    defaultsDisplayNames.map((name, _iName) => {
      if ((_node as any).type.displayName === `${checkDisplayName}${name}`) {
        if (getTableCompoundDefaultComponents.length === defaultsDisplayNames.length) {
          FinalChildren.current[_index] = _node;
        }
        else {
          defaultComponentsState[_iName] = _node;
        }
      }
    })
  };

  getTableCompoundDefaultComponents.map(RenderResult);

  const result = FinalChildren.current.every(_node => isValidElement(_node)) ? children : defaultComponentsState;

  useEffect(() => {
    if (getCustomChildren().length > 0) {
      console.warn(`
        to see custom components or elements inside of the section 
        you need to add all default children components to the parent section
      `);
    }
  }, [getCustomChildren().length])

  return { CustomChildren: getCustomChildren(), FinalChildren: result }
}