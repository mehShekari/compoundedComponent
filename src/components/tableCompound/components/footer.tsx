import { usePageCompoundContext } from "../../pageCompound/pageCompound";

const TableCompoundFooter = () =>
{
    const { data } = usePageCompoundContext()
    return <tfoot>
        <tr>
            <th scope="row">Totals</th>
            <td>{data.length} length</td>
        </tr>
    </tfoot>
}


TableCompoundFooter.displayName = "compound-table-footer"
export default TableCompoundFooter;