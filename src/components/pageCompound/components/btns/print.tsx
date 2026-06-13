import { usePageCompoundActionsContext } from "../actions";

type PrintComponentProps = {
  onClick?: () => void;
};

export default function PrintComponent({ onClick }: PrintComponentProps) {
  const { printHandler } = usePageCompoundActionsContext();

  return (
    <button
      type="button"
      aria-label="Print"
      onClick={() => (onClick ? onClick() : printHandler())}
    >
      Print
    </button>
  );
}
