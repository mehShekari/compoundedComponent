import { useState, useContext, createContext, SetStateAction } from "react";

import PageCompoundHeader from "./components/header";
import PageCompoundBody from "./components/body";
import PageCompoundFooter from "./components/footer";
import useFilterNodeChildren from "../../hooks/useFilterNodeChildren";

/**
 * * PAGE_COMPOUND 
*/

const PageCompoundContext = createContext({} as {
    data: {name: string, age: number}[],
    setData: React.Dispatch<SetStateAction<any>>
    getTest: (e: string) => void
});
export function usePageCompoundContext()
{
    return useContext(PageCompoundContext)
}

function PageCompound({ children }: { children?: React.ReactNode }){
    const [data, setData] = useState([{ name: "ali", age: 22 }, { name: "javad", age: 12 }, { name: "aydin", age: 38 }])

    const getTest = (e: string) =>
    {
        console.log(e)
    }

    const { FinalChildren } = useFilterNodeChildren({
        children,
        checkDisplayName: "compound-page-",
        defaultsDisplayNames:  ['header', 'body', 'footer'],
        defaultComponents:  [
            <PageCompoundHeader key={"header"} />,
            <PageCompoundBody key={"body"} />,
            <PageCompoundFooter key={"footer"} />,
        ]
    })

    return <PageCompoundContext.Provider value={{
        data, setData,
        getTest
    }}>
        {/* {CustomChildren} */}
        {FinalChildren}
    </PageCompoundContext.Provider>
}

PageCompound.Header = PageCompoundHeader;
PageCompound.Body = PageCompoundBody;
PageCompound.Footer = PageCompoundFooter;

export default PageCompound