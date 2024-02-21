import { useContext, createContext } from "react";

import MappedTr from "./mappedTr";

/**
 * *TABLE COMPOUND BODY 
*/

interface MyComponentProps {
    mapTr?: JSX.Element;
    mapTd?: JSX.Element;
    filter?: (item: any) => boolean | any
    data?: any[]
}

const TableCompoundBodyContext = createContext({});
export function useTableCompoundBodyContext()
{
    return useContext(TableCompoundBodyContext)
}

const TableCompoundBody = ({ mapTd, mapTr, filter }: MyComponentProps) =>
{
    const data: any[] = [{ name: "ali", age: 22 }]

    if (filter)
    {
        data.filter(filter).map(_item => console.log(_item))
    }

    return (
        <TableCompoundBodyContext.Provider value={{}}>
            <tbody>
                {
                    data.map((_row, _index) => <MappedTr row={_row} key={_index} />)
                }
                <MappedTr />
            </tbody>
        </TableCompoundBodyContext.Provider>
    )
}
export default TableCompoundBody