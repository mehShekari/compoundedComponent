import { useTableCompoundActionContext } from "../actions";
import type { UserRow } from "../../../../types/page.types";

type DetailComponentProps = {
  onClick?: (row: UserRow) => void;
};

export const DetailComponent = ({ onClick }: DetailComponentProps) => {
  const { detailHandler, row } = useTableCompoundActionContext();

  return (
    <button
      type="button"
      aria-label={`View details for ${row.name}`}
      onClick={() => (onClick ? onClick(row) : detailHandler(row))}
    >
      Detail
    </button>
  );
};
