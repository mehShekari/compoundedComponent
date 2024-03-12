import { createContext, useContext } from "react";

import AddComponent from "./btns/add";
import ExcelComponent from "./btns/excel";
import PrintComponent from "./btns/print";
import { usePageCompoundContext } from "../pageCompound";

interface CommonTypes {
    addHandler: (args?: any) => any,
    ExcelHandler: (args?: any) => any,
    PrintHandler: (args?: any) => any
}

interface childrenArgsTypes extends CommonTypes {
    addBtn: any,
    PrintBtn: any,
    excelBtn: any,
}

const PageCompoundActionsContext = createContext({} as CommonTypes & { btnClassName?: string });
export function usePageCompoundActionsContext()
{
    return useContext(PageCompoundActionsContext);
}

interface IProps {
    className?: string
    children?: ((args: childrenArgsTypes) => any) | React.ReactNode
    btnClassName?: string 
}

const Actions = ({ className, children, btnClassName }: IProps) =>
{
    const { setData, data } = usePageCompoundContext() 

    const addHandler = () =>
    {
        setData(() =>
        {
            return [...data, {
                name: "John", age: 55
            }]
        })
    }

    const ExcelHandler = () =>
    {

    }

    const PrintHandler = () =>
    {

    }

    return <PageCompoundActionsContext.Provider value={{
        addHandler,
        ExcelHandler,
        PrintHandler,
        btnClassName
    }}> 
        <div style={{ display: "flex", gap: "3px" }} className={className}>
            
            {children == null && (<>    
                    <AddComponent />
                    <ExcelComponent />
                    <PrintComponent />
                </>)}
                {children && (children instanceof Function) && children({
                    addBtn: AddComponent,
                    excelBtn: ExcelComponent,
                    PrintBtn: PrintComponent,
                    addHandler,
                    ExcelHandler,
                    PrintHandler
                })}
                {children && !(children instanceof Function) && children}
        </div>
    </PageCompoundActionsContext.Provider>
}

Actions.Add = AddComponent;
Actions.Excel = ExcelComponent;
Actions.Print = PrintComponent;

Actions.displayName = "header-actions";
export default Actions; 