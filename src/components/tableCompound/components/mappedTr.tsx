import TableCompoundActions from "./actions";

export default function MappedTr({ row }: any)
{
    return <div>
        <tr>
            <td>
                <div className="px-2" style={{ padding: "5px" }}>hello there</div>
            </td>

            <td>
                <div className="px-2" style={{ padding: "5px" }}> i wanna break your ass</div>
            </td>

            <td>
                <div className="px-2" style={{ padding: "5px" }}> <TableCompoundActions /> </div>
            </td>
        </tr>
    </div>
}