import TableCompoundActions from "./actions"
import Td from "./td"

const TableCompoundRow = ({ children, className = "",...rest }: { 
    children?: React.ReactNode, 
    rest?: React.DOMAttributes<any> 
    className?: string
}): JSX.Element =>
{
    return <tr 
        onClick={() => console.log("click")}
        className={className} 
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