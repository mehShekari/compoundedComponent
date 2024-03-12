import { useTableCompoundActionContext } from "../actions";

export const DetailComponent = ({ onClick }: { onClick?: (arg: any) => void }) =>
{
    const { detailHandler, row } = useTableCompoundActionContext();

    return <button onClick={() => onClick ? onClick(row) : detailHandler(row)}>detail</button>
}