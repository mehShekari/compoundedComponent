import { useContext, createContext, useState, SetStateAction } from "react";

import TableCompoundActions from "./actions";
import TableCompoundRow from "./row";
import { usePageCompoundContext } from "../../pageCompound/pageCompound";

/**
 * *TABLE COMPOUND BODY 
*/

interface MyComponentProps {
    filter?: (item: any) => boolean | any;
    children?: (args: any) => any
    data?: any[]
}

const TableCompoundBodyContext = createContext({});
export function useTableCompoundBodyContext()
{
    return useContext(TableCompoundBodyContext)
}

const TableCompoundBody = ({ filter = () => true, children }: MyComponentProps) =>
{
    const { data } = usePageCompoundContext() 
    return (
        <TableCompoundBodyContext.Provider value={{  }}>
            <tbody>
                {
                    data.filter(filter).map((_row, _index) => children ? children({
                        item: _row,
                        index: _index,
                        Row: TableCompoundRow
                    }): <TableCompoundRow key={_index} row={_row} />)
                }
            </tbody>
        </TableCompoundBodyContext.Provider>
    )
}

TableCompoundBody.Row = TableCompoundRow;
TableCompoundBody.Action = TableCompoundActions;

TableCompoundBody.displayName = "compound-table-body";
export default TableCompoundBody