import { useTableCompoundContext } from "../tableCompound";

const Td = ({ row }: { row: any }) =>
{
    const { columns } = useTableCompoundContext();
    return <>
        {
            columns.map(_col =>
            {
                if(row[_col] == null) return;
                return <td>
                    <div key={row[_col]} 
                        className="px-2" 
                        style={{ padding: "5px", textAlign: "left" }}
                    >
                        {row[_col]}
                    </div>
                </td>
            })
        }
    </>
}

Td.displayName = "row-td";
export default Td