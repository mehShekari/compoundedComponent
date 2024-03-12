import { createContext, useContext } from "react";

import TableCompoundActions from "./actions"
import Td from "./td"
interface Required extends IProps {
  children?: never,
  row: any
}

interface Optional extends IProps {
  children: React.ReactNode,
  row?: never
}

interface IProps {
  rest?: React.DOMAttributes<any>
  className?: string
  index: number
}

const TableCompoundRowContext = createContext({});
export function useTableCompoundRowContext() {
  return useContext(TableCompoundRowContext)
}

const TableCompoundRow = ({ children, row, className = "", index, ...rest }: Optional | Required): JSX.Element => {
  // todo i have to map on columns and rows here because i need id from each rows to send it to  TableCompoundActions and Td
  return <TableCompoundRowContext.Provider value={{}}>
    <tr
      onClick={() => console.log("click")}
      className={className}
      {...rest.rest}
    >
      {children && !row && children}
      {!children && row && <>
        <Td row={row} />
        <TableCompoundActions row={row} index={index}  />
      </>}
    </tr>
  </TableCompoundRowContext.Provider>
}

TableCompoundRow.Actions = TableCompoundActions;
TableCompoundRow.Td = Td;


export default TableCompoundRow