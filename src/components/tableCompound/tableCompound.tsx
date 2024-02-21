import React, { useContext, createContext, useState } from "react";
import TableCompoundBody from "./components/body";
import TableCompoundFooter from "./components/footer";
import TableCompoundHeader from "./components/header";
/**
 * * TABLE_COMPOUND 
*/

const TableCompoundContext = createContext({});
export function useTableCompoundContext()
{
    return useContext(TableCompoundContext)
}

function TableCompound({ children }: { children: React.ReactNode })
{
    const [tableCom1, setTableCom1] = useState("");
    
    const getTableTest = (e: string) =>
    {
        console.log(e)
    }

    return <TableCompoundContext.Provider value={{ tableCom1, setTableCom1, getTableTest }}>
        <table style={{ border: "1px solid #f1f1f1",  borderRadius: "5px", padding: "7px" }}>
            {children}
        </table>
    </TableCompoundContext.Provider>
}

TableCompound.Header = TableCompoundHeader;
TableCompound.Body = TableCompoundBody;
TableCompound.Footer = TableCompoundFooter;

export default TableCompound