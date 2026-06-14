import { useMemo } from "react";

import TableCompoundBody from "./components/body";
import TableCompoundFooter from "./components/footer";
import TableCompoundHeader from "./components/header";
import { TableCompoundContext } from "./context/tableCompoundContext";
import useFilterNodeChildren from "../hooks/useFilterNodeChildren";
import ErrorBoundary from "../utils/errorBoundary";
import FallBack from "../utils/fallback";
import { COMPOUND_BORDER_STYLE } from "../constants/defaultTableConfig";

export { useTableCompoundContext } from "./context/tableCompoundContext";
export { useTableData, TableDataContext } from "./context/tableDataContext";

const TABLE_COMPOUND_DEFAULT_SLOTS = [
  <TableCompoundHeader key="header" />,
  <TableCompoundBody key="body" />,
  <TableCompoundFooter key="footer" />,
];

type TableCompoundProps = {
  children: React.ReactNode;
  columns: string[];
  captions: string[];
};

function TableCompound({ children, captions, columns }: TableCompoundProps) {
  const contextValue = useMemo(
    () => ({ captions, columns }),
    [captions, columns],
  );

  const { finalChildren } = useFilterNodeChildren({
    children,
    checkDisplayName: "compound-table-",
    defaultsDisplayNames: ["header", "body", "footer"],
    defaultComponents: TABLE_COMPOUND_DEFAULT_SLOTS,
  });

  return (
    <ErrorBoundary fallBack={(message) => <FallBack message={message} />}>
      <TableCompoundContext.Provider value={contextValue}>
        <table
          style={{
            ...COMPOUND_BORDER_STYLE,
            borderRadius: "5px",
            padding: "7px",
            width: "100%",
          }}
        >
          {finalChildren}
        </table>
      </TableCompoundContext.Provider>
    </ErrorBoundary>
  );
}

TableCompound.Header = TableCompoundHeader;
TableCompound.Body = TableCompoundBody;
TableCompound.Footer = TableCompoundFooter;

export default TableCompound;
