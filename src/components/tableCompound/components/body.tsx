import { useContext, createContext, ReactElement } from "react";

import TableCompoundActions from "./actions"

/**
 * *TABLE COMPOUND BODY 
*/

interface MyComponentProps{
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



const TableCompoundBody = ({ mapTd, mapTr, filter }: MyComponentProps) => {
  const data: any[] = [{ name: "ali", age: 22 }]

  if(filter) {
    data.filter(filter).map(_item => console.log(_item))
  } 
     
  
  return (
    <TableCompoundBodyContext.Provider value={{}}>
      <tbody>
        <tr>
          <td>
            <div className="px-2" style={{ padding: "5px" }}>hello there</div>
          </td>

          <td>
            <div className="px-2" style={{ padding: "5px" }}> i wanna break your ass</div>
          </td>

          <td>
            <div className="px-2" style={{ padding: "5px" }}> <TableCompoundActions /> </div>
          </td>
        </tr>
      </tbody>
    </TableCompoundBodyContext.Provider>
  )
}
export default TableCompoundBody