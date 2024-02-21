import { useState, useContext, createContext } from "react";

import PageCompoundHeader from "./components/header";
import PageCompoundBody from "./components/body";
import PageCompoundFooter from "./components/footer";

/**
 * * PAGE_COMPUND 
*/

const PageCompoundContext = createContext({});
export function usePageCompoundContext()
{
    return useContext(PageCompoundContext)
}

function PageCompound({ children }: { children: React.ReactNode }){
    const [state1, setState1] = useState();
    const [state2, setState2] = useState();
    const [state3, setState3] = useState();

    const getTest = (e: string) =>
    {
        console.log(e)
    }

    return <PageCompoundContext.Provider value={{
        state1, setState1,
        state2, setState2,
        state3, setState3,
        getTest
    }}>
        {children}
    </PageCompoundContext.Provider>
}

PageCompound.Header = PageCompoundHeader;
PageCompound.Body = PageCompoundBody;
PageCompound.Footer = PageCompoundFooter;

export default PageCompound