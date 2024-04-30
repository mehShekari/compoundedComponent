import { createContext, useContext } from "react";
import { DeleteComponent } from "./btns/delete";
import { EditComponent } from "./btns/edit";
import { DetailComponent } from "./btns/detail";



interface CommonTypes {
  DeleteHandler: (e: React.MouseEvent<HTMLElement>, args: any) => any,
  editHandler: (args: any) => any,
  detailHandler: (args: any) => any
}

interface childrenArgsTypes extends CommonTypes {
  DeleteBtn: JSX.ElementType,
  EditBtn: JSX.ElementType,
  DetailBtn: JSX.ElementType,
}

const TableCompoundActionContext = createContext({} as CommonTypes & { row: any, index: number });
export const useTableCompoundActionContext = () => {
  return useContext(TableCompoundActionContext);
}

interface IProps {
  row: any
  children?: ((args: childrenArgsTypes) => JSX.Element) | React.ReactNode
  className?: string
  index: number
}

const TableCompoundActions = ({ children, row, className, index }: IProps) => {

  const DeleteHandler = (e: React.MouseEvent<HTMLElement>, _row: any) => { console.log(e); }

  const editHandler = (_row: any) => {console.log(_row) }

  const detailHandler = (_row: any) => { console.log(_row) }

  return <TableCompoundActionContext.Provider value={{
    DeleteHandler,
    editHandler,
    detailHandler,
    row,
    index
  }}>
    <td
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      className={className}
    >
      <div className="px-2 flex items-stretch gap-2">
        {children == null && (<>
          <EditComponent />
          <DeleteComponent />
        </>)}
        {children && (children instanceof Function) && children({
          DeleteBtn: DeleteComponent,
          EditBtn: EditComponent,
          DetailBtn: DetailComponent,
          DeleteHandler,
          detailHandler,
          editHandler
        })}
        {children && !(children instanceof Function) && children}
      </div>
    </td>
  </TableCompoundActionContext.Provider>
}

TableCompoundActions.Delete = DeleteComponent;
TableCompoundActions.Edit = EditComponent;
TableCompoundActions.Detail = DetailComponent;
export default TableCompoundActions;