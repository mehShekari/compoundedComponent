import TableCompoundActions from "./actions"
import Td from "./td"

const TableCompoundRow = ({ children,...rest }: { 
    children?: React.ReactNode, 
    rest?: React.DOMAttributes<any> 
}): JSX.Element =>
{
    return <tr 
        onClick={() => console.log("click")} 
        {...rest.rest}
    >
        {children && children}
        {!children && <>
            <Td />
            <TableCompoundActions />
        </>}
    </tr>
}

export default TableCompoundRow