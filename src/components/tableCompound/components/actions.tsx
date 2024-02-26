import { createContext, useContext } from "react";


interface childrenArgsTypes  {
    DeleteBtn: any,
    EditBtn: any,
    DetailBtn: any,
    DeleteHandler: (args: any) => any,
    editHandler: (args: any) => any,
    detailHandler: (args: any) => any
}

const TableCompoundActionContext = createContext({} as {
    DeleteHandler: (args: any) => any,
    editHandler: (args: any) => any,
    detailHandler: (args: any) => any,
    row: any
});
export const useTableCompoundActionContext = () =>
{
    return useContext(TableCompoundActionContext);
}


const TableCompoundActions = ({ children, row }: { row:any, children?: ((args: childrenArgsTypes) => any) | React.ReactNode }) => 
{
    const DeleteHandler = (row: any) =>
    {
        console.log("default click", row)
    }

    const editHandler = () =>
    {

    }

    const detailHandler = () =>
    {

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

const DeleteComponent = ({ onClick }: { onClick?: (arg: any) => void }) =>
{
    const { DeleteHandler, row } = useTableCompoundActionContext();
    return <button onClick={() => onClick ? onClick(row) : DeleteHandler(row)}>delete</button>
}

const EditComponent = () =>
{
    return <button>edit</button>
}

const DetailComponent = () =>
{
    return <button>detail</button>
}

TableCompoundActions.Delete = DeleteComponent;
TableCompoundActions.Edit = EditComponent;
TableCompoundActions.Detail = DetailComponent;

export default TableCompoundActions;