import React, { useContext, createContext } from 'react';
import useFilterNodeChildren from "../../../hooks/useFilterNodeChildren";
import Actions from "./actions";
import MultiSearch from "./multiSearch";
import SingleSearch from "./singleSearch";

/**
 * *PAGE_COMPOUND_HEADER 
*/

const PageCompoundHeaderContext = createContext({});
export function usePageCompoundHeaderContext ()
{
    return useContext(PageCompoundHeaderContext);
}

const PageCompoundHeader = ({ children }: { children?: React.ReactNode }) => {
    const { CustomChildren, FinalChildren } = useFilterNodeChildren({
        children,
        checkDisplayName: "header-",
        defaultsDisplayNames: ['multiSearch', 'singleSearch', 'actions'],
        defaultComponents: [
            <Actions key={"actions"} />,
            <SingleSearch key={"singleSearch"} />,
            <MultiSearch key={"multiSearch"} />,
        ]   
    })

    return (
        <PageCompoundHeaderContext.Provider value={{}} >
            <div style={{ 
                border: "1px solid #f1f1f1", borderRadius: "7px", padding: "5px", 
                marginBottom: "5px", display: "flex", alignItems: "center", justifyContent: "center",
                gap: "5px" 
            }} key={"header"}>
                {CustomChildren}
                {FinalChildren}
            </div>
        </PageCompoundHeaderContext.Provider>
    )
}

PageCompoundHeader.Actions = Actions;
PageCompoundHeader.SingleSearch = SingleSearch;
PageCompoundHeader.MultiSearch = MultiSearch;

export default PageCompoundHeader;

