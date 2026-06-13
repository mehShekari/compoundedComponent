import TableCompoundActions from "./actions";
import TableCompoundRow from "./row";
import { useTableData } from "../context/tableDataContext";
import type { UserRow } from "../../../types/page.types";
import type { TableRowFilter } from "../../../types/table.types";

type TableBodyRenderProps = {
  item: UserRow;
  index: number;
  Row: typeof TableCompoundRow;
};

type TableCompoundBodyProps = {
  filter?: TableRowFilter<UserRow>;
  children?: (args: TableBodyRenderProps) => React.ReactNode;
};

const TableCompoundBody = ({ filter = () => true, children }: TableCompoundBodyProps) => {
  const { data } = useTableData();

  return (
    <tbody>
      {data.filter(filter).map((row, index) =>
        children ? (
          children({ item: row, index, Row: TableCompoundRow })
        ) : (
          <TableCompoundRow key={row.id} row={row} index={index} />
        ),
      )}
    </tbody>
  );
};

TableCompoundBody.Row = TableCompoundRow;
TableCompoundBody.Action = TableCompoundActions;

TableCompoundBody.displayName = "compound-table-body";
export default TableCompoundBody;
