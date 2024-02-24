import React, { useContext, createContext, useState, isValidElement, ReactElement } from "react";
import TableCompoundBody from "./components/body";
import TableCompoundFooter from "./components/footer";
import TableCompoundHeader from "./components/header";
/**
 * * TABLE_COMPOUND 
*/
const defaultTableCompoundDisplayNames = ['header', 'body', 'footer'];
const DefaultTableCompoundComponents = [
    <TableCompoundHeader key={"header"} />,
    <TableCompoundBody key={"body"} />,
    <TableCompoundFooter key={"footer"} />
]

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

    const TableCompoundDefaultCompounents = React.Children.toArray(children).filter(_childNode =>{
        return isValidElement(_childNode) 
            && (_childNode as any).type.displayName && (_childNode as any).type.displayName.includes("compound-table")
    }) as ReactElement[];
    
    const CustomChildren = React.Children.toArray(children).filter(_childNode =>{
        return isValidElement(_childNode) 
            && !(_childNode as any).type.displayName
    }) as ReactElement[];
    
    const FinalChildren: any[] = Array().fill(null, 0, TableCompoundDefaultCompounents.length - 1);


    const dynamicIf = (_node: any, _index: number) =>
    {
        defaultTableCompoundDisplayNames.map((name, _iName) =>
        {
            if((_node as any).type.displayName === `compound-table-${name}`)
            {
                if (TableCompoundDefaultCompounents.length === defaultTableCompoundDisplayNames.length)
                    FinalChildren[_index] = _node
                else
                {
                    DefaultTableCompoundComponents[_iName] = _node
                }
            }
        })
    }

    TableCompoundDefaultCompounents.forEach(dynamicIf)

    return <TableCompoundContext.Provider value={{ tableCom1, setTableCom1, getTableTest }}>
        <table style={{ border: "1px solid #f1f1f1",  borderRadius: "5px", padding: "7px" }}>
            {CustomChildren}
            {FinalChildren.length > 0 ? FinalChildren : DefaultTableCompoundComponents.map(_node => _node)}
        </table>
    </TableCompoundContext.Provider>
}

TableCompound.Header = TableCompoundHeader;
TableCompound.Body = TableCompoundBody;
TableCompound.Footer = TableCompoundFooter;

export default TableCompound