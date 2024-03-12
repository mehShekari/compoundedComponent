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
    // const dispatch = useAppDispatch()
    const DeleteHandler = (e: React.MouseEvent<HTMLElement>, _row: any) => {
    //   dispatch(openModal({
    //     type: "delete-detail",
    //     cursor: {
    //       x: e.currentTarget.getBoundingClientRect().x + e.currentTarget.clientWidth + 5,
    //       y: e.currentTarget.getBoundingClientRect().y + e.currentTarget.clientHeight
    //     },
    //     payload: { ...row },
    //     status: true
    //   }))
    }
   
    const editHandler = (_row: any) => {
    //   dispatch(fetchFindOne({ ...row, type: "edit" }))
    }
  
    const detailHandler = (_row: any) => {
    //   dispatch(toggleModal({ type: "details", status: true, payload: { ...row } }))
    }
  
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