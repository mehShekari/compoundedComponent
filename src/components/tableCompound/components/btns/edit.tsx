import { useTableCompoundActionContext } from "../actions";

export const EditComponent = ({ onClick }: { onClick?: (arg: any) => void }) =>
{
    const { editHandler, row } = useTableCompoundActionContext();

    return <button  onClick={() => onClick ? onClick(row) : editHandler(row)}>edit</button>
}
