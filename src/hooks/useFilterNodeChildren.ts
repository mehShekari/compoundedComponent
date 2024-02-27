import React, { ReactElement, isValidElement, useCallback, useEffect, useRef } from "react";

/**
 * @param {
 *      children
 *      checkDisplayName
 *      defaultsDisplayNames
 *      defaultComponents
 * }
 * 
 * @returns {
 *      CustomChildren
 *      FinalChildren
 * }
 **/
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
})
{
    const defaultComponentsRef = useRef(defaultComponents);

    const getTableCompoundDefaultComponents = useCallback((): ReactElement[] =>
    {
        return React.Children.toArray(children).filter(_childNode =>
        {
            return isValidElement(_childNode)
                && (_childNode as any).type.displayName && (_childNode as any).type.displayName.includes(checkDisplayName)
        }) as ReactElement[];
    }, [])

    const getCustomChildren = useCallback(() =>
    {

        return  React.Children.toArray(children).filter(_childNode =>
        {
            return isValidElement(_childNode) && !(_childNode as any).type.displayName
        }) as ReactElement[];        
    }, [])
    
    const dynamicIf = (_node: any, _index: number) =>
    {
        defaultsDisplayNames.map((name, _iName) =>
        {
            if ((_node as any).type.displayName === `${checkDisplayName}${name}`)
            {
                if (getTableCompoundDefaultComponents().length === defaultsDisplayNames.length)
                {
                    FinalChildren[_index] = _node;
                }  
                else
                {
                    defaultComponentsRef.current[_iName] = _node;
                }
            }
        })
    };

    const FinalChildren: ReactElement[] = Array(
        getTableCompoundDefaultComponents().length === 0 ? 1 :
        getTableCompoundDefaultComponents().length
    ).fill(null);

    getTableCompoundDefaultComponents().forEach(dynamicIf);
    const result = FinalChildren.every(_node => isValidElement(_node)) ? children : defaultComponentsRef.current;

    useEffect(() =>
    {
        if(getCustomChildren().length > 0)
        {
            console.warn(`
                to see custom components or elements inside of the section 
                you need to add all default children components to the parent section
            `);
        }
    }, [getCustomChildren().length])

    return { CustomChildren: getCustomChildren(), FinalChildren:  result }
}