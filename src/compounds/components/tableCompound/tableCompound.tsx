import React, { useContext, createContext } from "react";

import TableCompoundBody from "./components/body";
import TableCompoundFooter from "./components/footer";
import TableCompoundHeader from "./components/header";

import useFilterNodeChildren from "../../hooks/useFilterNodeChildren";

import styles from "./styles/Table.module.css";
import { usePageCompoundContext } from "../pageCompound/pageCompound";

/**
 * * TABLE_COMPOUND 
*/

interface commonTypes {
  columns?: string[],
  captions?: string[],
  data?: any[]
}

interface IProps extends commonTypes {
  children?: React.ReactNode,
}

interface contextPropsType extends commonTypes {}

const TableCompoundContext = createContext({} as contextPropsType);
export function useTableCompoundContext() {
  return useContext(TableCompoundContext)
}

const DefaultComponents = [
  <TableCompoundHeader key={"header"} />,
  <TableCompoundBody key={"body"} />,
  <TableCompoundFooter key={"footer"} />,
]

function TableCompound({ children, captions, columns}: IProps) {
  const { headerData, headerEnData } = usePageCompoundContext();
  // const [columns, setColumns] = useState<string[]>([])
  // const [captions, setCaptions] = useState<string[]>([])

  // useEffect(() => {
  //   if (!columnsProp || !captionsProp) return

  //   const width = window.innerWidth
  //   let count = columnsProp?.length

  //   if (width <= 768) count = 5
  //   else if (width <= 1280) count = 10
  //   else if (width <= 1536) count = 15
  //   else if (width <= 1800) count = 20

  //   setColumns(columnsProp.filter((_, idx) => idx < count))
  //   setCaptions(captionsProp.filter((_, idx) => idx < count))
  // }, [columnsProp, captionsProp])

  const { FinalChildren } = useFilterNodeChildren({
    children,
    checkDisplayName: "compound-table-",
    defaultsDisplayNames: ['header', 'body', 'footer'],
    defaultComponents: DefaultComponents
  })
  
  return <TableCompoundContext.Provider value={{ 
    captions: captions ?? headerData, 
    columns: columns ?? headerEnData 
  }}>
    <div className='overflow-auto'>
      <table className={`!p-0 ${styles.table}`}>
        {FinalChildren}
      </table>
    </div>
  </TableCompoundContext.Provider>
}

TableCompound.Header = TableCompoundHeader;
TableCompound.Body = TableCompoundBody;
TableCompound.Footer = TableCompoundFooter;

export default TableCompound