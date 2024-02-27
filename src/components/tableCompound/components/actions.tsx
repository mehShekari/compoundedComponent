import { createContext, useContext } from "react";
import { DeleteComponent } from "./btns/delete";
import { EditComponent } from "./btns/edit";
import { DetailComponent } from "./btns/detail";


interface CommonTypes {
    DeleteHandler: (args: any) => any,
    editHandler: (args: any) => any,
    detailHandler: (args: any) => any
}

interface childrenArgsTypes extends CommonTypes  {
    DeleteBtn: any,
    EditBtn: any,
    DetailBtn: any,
}

const TableCompoundActionContext = createContext({} as CommonTypes & { row: any });
export const useTableCompoundActionContext = () =>
{
    return useContext(TableCompoundActionContext);
}

interface IProps {
    row: any
    children?: ((args: childrenArgsTypes) => any) | React.ReactNode 
}

const TableCompoundActions = ({ children, row }: IProps) => 
{
    const DeleteHandler = (_row: any) =>
    {
        console.log("default click", _row)
    }

    const editHandler = (_row: any) =>
    {
        console.log("default click edit", _row)
    }

    const detailHandler = (_row: any) =>
    {
        console.log("default click detail", row)
    }

    return <TableCompoundActionContext.Provider value={{
        DeleteHandler,
        editHandler,
        detailHandler,
        row
    }}>
        <td 
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}            
        >
            <div className="px-2" style={{ padding: "5px", textAlign: "left" }}>
                {children == null && (<>    
                    <DeleteComponent />
                    <EditComponent />
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