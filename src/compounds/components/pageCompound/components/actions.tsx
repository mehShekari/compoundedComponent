import { createContext, useContext } from "react";

import AddComponent from "./btns/add";
import ExcelComponent from "./btns/excel";
import PrintComponent from "./btns/print";
import { useAppDispatch } from "@hooks/redux";
import { toggleModal } from "@redux/slices/modalSlice";

interface CommonTypes {
  addHandler: (args?: any) => any,
  ExcelHandler: (args?: any) => any,
  PrintHandler: (args?: any) => any
}

interface childrenArgsTypes extends CommonTypes {
  AddBtn: JSX.ElementType,
  PrintBtn: JSX.ElementType,
  ExcelBtn: JSX.ElementType,
}

const PageCompoundActionsContext = createContext({} as CommonTypes & { btnClassName?: string });
export function usePageCompoundActionsContext() {
  return useContext(PageCompoundActionsContext);
}

interface IProps {
  className?: string
  children?: ((args: childrenArgsTypes) => JSX.Element) | React.ReactNode
  btnClassName?: string
}

const Actions = ({ className, children, btnClassName }: IProps) => {
  const dispatch = useAppDispatch();

  const addHandler = () => {
    dispatch(toggleModal({ type: "add", status: true, payload: { pin: false } }))
  }

  const ExcelHandler = () => {

  }

  const PrintHandler = () => {

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
        AddBtn: AddComponent,
        ExcelBtn: ExcelComponent,
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


export interface BtnTypes {
  rest?: React.DOMAttributes<any>
  onClick?: (arg?: any) => void
}


