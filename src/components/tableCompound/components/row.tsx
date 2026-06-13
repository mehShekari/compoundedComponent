import TableCompoundActions from "./actions";
import Td from "./td";
import type { UserRow } from "../../../types/page.types";

type RowWithData = {
  children?: never;
  row: UserRow;
  index: number;
  className?: string;
};

type RowWithChildren = {
  children: React.ReactNode;
  row?: never;
  index?: number;
  className?: string;
};

type TableCompoundRowProps = RowWithData | RowWithChildren;

const TableCompoundRow = ({
  children,
  row,
  className = "",
  index = 0,
}: TableCompoundRowProps): JSX.Element => (
  <tr className={className}>
    {children && !row && children}
    {!children && row && (
      <>
        <Td row={row} />
        <TableCompoundActions row={row} index={index} />
      </>
    )}
  </tr>
);

TableCompoundRow.Actions = TableCompoundActions;
TableCompoundRow.Td = Td;

export default TableCompoundRow;
