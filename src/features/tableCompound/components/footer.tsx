import { useTableData } from "../context/tableDataContext";
import { useTableCompoundContext } from "../context/tableCompoundContext";

const TableCompoundFooter = () => {
  const { data } = useTableData();
  const { columns } = useTableCompoundContext();

  return (
    <tfoot>
      <tr>
        <td colSpan={columns.length + 1} style={{ textAlign: "left", padding: "5px" }}>
          {data.length} rows
        </td>
      </tr>
    </tfoot>
  );
};

TableCompoundFooter.displayName = "compound-table-footer";
export default TableCompoundFooter;
