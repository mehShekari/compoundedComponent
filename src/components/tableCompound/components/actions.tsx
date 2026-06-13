import { createContext, useCallback, useContext, useMemo, type ComponentType } from "react";

import { DeleteComponent } from "./btns/delete";
import { EditComponent } from "./btns/edit";
import { DetailComponent } from "./btns/detail";
import { useTableData } from "../context/tableDataContext";
import type { UserRow } from "../../../types/page.types";

type TableCompoundActionsContextValue = {
  deleteHandler: (row: UserRow, event?: React.MouseEvent<HTMLElement>) => void;
  editHandler: (row: UserRow) => void;
  detailHandler: (row: UserRow) => void;
  row: UserRow;
  index: number;
};

type TableCompoundActionsRenderProps = Pick<
  TableCompoundActionsContextValue,
  "deleteHandler" | "editHandler" | "detailHandler"
> & {
  deleteBtn: ComponentType<{ onClick?: (row: UserRow) => void }>;
  editBtn: ComponentType<{ onClick?: (row: UserRow) => void }>;
  detailBtn: ComponentType<{ onClick?: (row: UserRow) => void }>;
};

const TableCompoundActionContext = createContext<TableCompoundActionsContextValue | null>(null);

export function useTableCompoundActionContext(): TableCompoundActionsContextValue {
  const context = useContext(TableCompoundActionContext);
  if (!context) {
    throw new Error("useTableCompoundActionContext must be used within TableCompoundActions");
  }
  return context;
}

type TableCompoundActionsProps = {
  row: UserRow;
  index: number;
  children?: ((args: TableCompoundActionsRenderProps) => React.ReactNode) | React.ReactNode;
  className?: string;
};

const TableCompoundActions = ({
  children,
  row,
  className,
  index,
}: TableCompoundActionsProps) => {
  const { setData } = useTableData();

  const deleteHandler = useCallback(
    (targetRow: UserRow, event?: React.MouseEvent<HTMLElement>) => {
      event?.stopPropagation();
      setData((prev) => prev.filter((item) => item.id !== targetRow.id));
    },
    [setData],
  );

  const editHandler = useCallback((targetRow: UserRow) => {
    // TODO: implement edit flow
    void targetRow;
  }, []);

  const detailHandler = useCallback((targetRow: UserRow) => {
    // TODO: implement detail view
    void targetRow;
  }, []);

  const contextValue = useMemo(
    () => ({
      deleteHandler,
      editHandler,
      detailHandler,
      row,
      index,
    }),
    [deleteHandler, editHandler, detailHandler, row, index],
  );

  const renderProps: TableCompoundActionsRenderProps = {
    deleteBtn: DeleteComponent,
    editBtn: EditComponent,
    detailBtn: DetailComponent,
    deleteHandler,
    editHandler,
    detailHandler,
  };

  return (
    <TableCompoundActionContext.Provider value={contextValue}>
      <td
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className={className}
      >
        <div className="px-2 flex items-stretch gap-2">
          {children == null && (
            <>
              <EditComponent />
              <DeleteComponent />
            </>
          )}
          {typeof children === "function" && children(renderProps)}
          {children != null && typeof children !== "function" && children}
        </div>
      </td>
    </TableCompoundActionContext.Provider>
  );
};

TableCompoundActions.Delete = DeleteComponent;
TableCompoundActions.Edit = EditComponent;
TableCompoundActions.Detail = DetailComponent;

export default TableCompoundActions;
