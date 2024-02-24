import { useContext, createContext } from "react";

import TableCompoundActions from "./actions";
import Td from "./td";
import TableCompoundRow from "./row";

/**
 * *TABLE COMPOUND BODY 
*/

interface MyComponentProps {
    mapTr?: JSX.Element;
    mapTd?: JSX.Element;
    filter?: (item: any) => boolean | any;
    children?: (args: any) => any
    data?: any[]
}

const TableCompoundBodyContext = createContext({});
export function useTableCompoundBodyContext()
{
    return useContext(TableCompoundBodyContext)
}

const TableCompoundBody = ({ mapTd, mapTr, filter, children }: MyComponentProps) =>
{
    const data: any[] = [{ name: "ali", age: 22 }, { name: "javad", age: 12 }, { name: "aydin", age: 38 }]

    if (filter)
    {
        data.filter(filter).map(_item => console.log(_item))
    }

    return (
        <TableCompoundBodyContext.Provider value={{}}>
            <tbody>
                {
                    data.map((_row, _index) => children ? children({
                        row: _row,
                        index: _index
                    }): <TableCompoundRow key={_index} />)
                }
            </tbody>
        </TableCompoundBodyContext.Provider>
    )
}



TableCompoundBody.displayName = "compound-table-body";

TableCompoundBody.Row = TableCompoundRow;
TableCompoundBody.Action = TableCompoundActions;

export default TableCompoundBody