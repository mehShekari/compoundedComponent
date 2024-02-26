import React, { ReactElement, isValidElement, useRef } from "react";

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


    const getTableCompoundDefaultComponents = (): ReactElement[] =>
    {
        return React.Children.toArray(children).filter(_childNode =>
        {
            return isValidElement(_childNode)
                && (_childNode as any).type.displayName && (_childNode as any).type.displayName.includes(checkDisplayName)
        }) as ReactElement[];
    }

    const getCustomChildren = () =>
    {
        return  React.Children.toArray(children).filter(_childNode =>
        {
            return isValidElement(_childNode) && !(_childNode as any).type.displayName
        }) as ReactElement[];
        
    }
    
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
    const result = FinalChildren.every(_node => isValidElement(_node)) ? FinalChildren : defaultComponentsRef.current;

    return { CustomChildren: getCustomChildren(), FinalChildren:  result }
}