import { usePageCompoundActionsContext } from "../actions";

type AddComponentProps = {
  onClick?: () => void;
};

export default function AddComponent({ onClick }: AddComponentProps) {
  const { addHandler } = usePageCompoundActionsContext();

  return (
    <button
      type="button"
      aria-label="Add row"
      onClick={() => (onClick ? onClick() : addHandler())}
    >
      + Add
    </button>
  );
}
