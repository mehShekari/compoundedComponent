import { useTableCompoundActionContext } from "../actions";

export const DeleteComponent = ({ onClick }: { onClick?: (arg: any) => void }) =>
{
    const { DeleteHandler, row } = useTableCompoundActionContext();
    return <button onClick={() => onClick ? onClick(row) : DeleteHandler(row)}>delete</button>
}
