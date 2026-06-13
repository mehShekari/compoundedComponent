import { useTableCompoundContext } from "../context/tableCompoundContext";
import type { UserRow } from "../../../types/page.types";

type TdProps = {
  row: UserRow;
};

const Td = ({ row }: TdProps) => {
  const { columns } = useTableCompoundContext();

  return (
    <>
      {columns.map((column) => {
        const value = row[column as keyof UserRow];
        if (value == null) return null;

        return (
          <td key={column}>
            <div className="px-2" style={{ padding: "5px", textAlign: "left" }}>
              {String(value)}
            </div>
          </td>
        );
      })}
    </>
  );
};

Td.displayName = "row-td";
export default Td;
