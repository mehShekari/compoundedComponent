import { useTableCompoundActionContext } from "../actions";
import type { UserRow } from "../../../types/page.types";

type EditComponentProps = {
  onClick?: (row: UserRow) => void;
};

export const EditComponent = ({ onClick }: EditComponentProps) => {
  const { editHandler, row } = useTableCompoundActionContext();

  return (
    <button
      type="button"
      aria-label={`Edit row ${row.name}`}
      onClick={() => (onClick ? onClick(row) : editHandler(row))}
    >
      Edit
    </button>
  );
};
