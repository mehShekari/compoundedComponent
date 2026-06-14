import { useTableCompoundActionContext } from "../actions";
import type { UserRow } from "../../../types/page.types";

type DeleteComponentProps = {
  onClick?: (row: UserRow) => void;
};

export const DeleteComponent = ({ onClick }: DeleteComponentProps) => {
  const { deleteHandler, row } = useTableCompoundActionContext();

  return (
    <button
      type="button"
      aria-label={`Delete row ${row.name}`}
      onClick={(e) => (onClick ? onClick(row) : deleteHandler(row, e))}
    >
      Delete
    </button>
  );
};
