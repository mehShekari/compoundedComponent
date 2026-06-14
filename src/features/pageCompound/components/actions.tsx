import { createContext, useCallback, useContext, useMemo, type ComponentType } from "react";

import AddComponent from "./btns/add";
import ExcelComponent from "./btns/excel";
import PrintComponent from "./btns/print";
import { useTableData } from "../../tableCompound/context/tableDataContext";

type PageCompoundActionsContextValue = {
  addHandler: () => void;
  excelHandler: () => void;
  printHandler: () => void;
  btnClassName?: string;
};

type PageCompoundActionsRenderProps = PageCompoundActionsContextValue & {
  addBtn: ComponentType<{ onClick?: () => void }>;
  excelBtn: ComponentType<{ onClick?: () => void }>;
  printBtn: ComponentType<{ onClick?: () => void }>;
};

const PageCompoundActionsContext = createContext<PageCompoundActionsContextValue | null>(null);

export function usePageCompoundActionsContext(): PageCompoundActionsContextValue {
  const context = useContext(PageCompoundActionsContext);
  if (!context) {
    throw new Error("usePageCompoundActionsContext must be used within PageCompound.Header.Actions");
  }
  return context;
}

type ActionsProps = {
  className?: string;
  children?: ((args: PageCompoundActionsRenderProps) => React.ReactNode) | React.ReactNode;
  btnClassName?: string;
};

const Actions = ({ className, children, btnClassName }: ActionsProps) => {
  const { setData } = useTableData();

  const addHandler = useCallback(() => {
    setData((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "John", age: 55 },
    ]);
  }, [setData]);

  const excelHandler = useCallback(() => {
    // TODO: implement Excel export
  }, []);

  const printHandler = useCallback(() => {
    // TODO: implement print
  }, []);

  const contextValue = useMemo(
    () => ({
      addHandler,
      excelHandler,
      printHandler,
      btnClassName,
    }),
    [addHandler, excelHandler, printHandler, btnClassName],
  );

  const renderProps: PageCompoundActionsRenderProps = {
    addBtn: AddComponent,
    excelBtn: ExcelComponent,
    printBtn: PrintComponent,
    addHandler,
    excelHandler,
    printHandler,
    btnClassName,
  };

  return (
    <PageCompoundActionsContext.Provider value={contextValue}>
      <div style={{ display: "flex", gap: "3px" }} className={className}>
        {children == null && (
          <>
            <AddComponent />
            <ExcelComponent />
            <PrintComponent />
          </>
        )}
        {typeof children === "function" && children(renderProps)}
        {children != null && typeof children !== "function" && children}
      </div>
    </PageCompoundActionsContext.Provider>
  );
};

Actions.Add = AddComponent;
Actions.Excel = ExcelComponent;
Actions.Print = PrintComponent;

Actions.displayName = "header-actions";
export default Actions;
