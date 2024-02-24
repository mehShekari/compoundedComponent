import { createContext, useContext } from "react";

const TableCompoundActionContext = createContext({});
export const useTableCompoundActionContext = () =>
{
    useContext(TableCompoundActionContext);
}

const TableCompoundActions = ({ children }: { children?: (args: any) => any }) => 
{
    return <TableCompoundActionContext.Provider value={{}}>
        <td>
            <div className="px-2" style={{ padding: "5px", textAlign: "left" }}>
                <AddComponent />
                <EditComponent />
                {children && children({
                    addBtn: <AddComponent />
                })}
            </div>
        </td>
    </TableCompoundActionContext.Provider>
}

const AddComponent = () =>
{
    return <button>add</button>
}

const EditComponent = () =>
{
    return <button>edit</button>
}

export default TableCompoundActions;