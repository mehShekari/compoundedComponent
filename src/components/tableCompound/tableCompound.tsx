import React, { useContext, createContext } from "react";
import TableCompoundBody from "./components/body";
import TableCompoundFooter from "./components/footer";
import TableCompoundHeader from "./components/header";
import useFilterNodeChildren from "../../hooks/useFilterNodeChildren";
/**
 * * TABLE_COMPOUND 
*/

interface IProps {
    children: React.ReactNode,
    columns: string[],
    captions: string[]
}

type contextPropsType = {
    columns: string[],
    captions: string[]
}

const TableCompoundContext = createContext({} as contextPropsType);
export function useTableCompoundContext()
{
    return useContext(TableCompoundContext)
}

function TableCompound({ children, captions, columns }: IProps)
{
    
    const { CustomChildren, FinalChildren } = useFilterNodeChildren({
        children,
        checkDisplayName: "compound-table-",
        defaultsDisplayNames:  ['header', 'body', 'footer'],
        defaultComponents:  [
            <TableCompoundHeader key={"header"} />,
            <TableCompoundBody key={"body"} />,
            <TableCompoundFooter key={"footer"} />,
        ]
    })

    return <TableCompoundContext.Provider value={{ captions, columns }}>
        <table style={{ border: "1px solid #f1f1f1",  borderRadius: "5px", padding: "7px", width: "100%" }}>
            {CustomChildren}
            {FinalChildren}
        </table>
    </TableCompoundContext.Provider>
}

TableCompound.Header = TableCompoundHeader;
TableCompound.Body = TableCompoundBody;
TableCompound.Footer = TableCompoundFooter;

export default TableCompound