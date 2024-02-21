import { useContext, createContext } from 'react';

/**
 * *PAGECOMPOUND_HEADER 
*/

const PageCompoundHeaderContext = createContext({});
export function usePageCompoundHeaderContext ()
{
    return useContext(PageCompoundHeaderContext);
}

const PageCompoundHeader = () => {
    return (
        <PageCompoundHeaderContext.Provider value={{}}>
            <div style={{ border: "1px solid #f1f1f1", borderRadius: "7px", padding: "5px", marginBottom: "5px" }}>
                page-Header
            </div>
        </PageCompoundHeaderContext.Provider>
    )
}

export default PageCompoundHeader