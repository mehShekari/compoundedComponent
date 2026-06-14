import { usePageCompoundActionsContext } from "../actions";

type ExcelComponentProps = {
  onClick?: () => void;
};

export default function ExcelComponent({ onClick }: ExcelComponentProps) {
  const { excelHandler } = usePageCompoundActionsContext();

  return (
    <button
      type="button"
      aria-label="Export to Excel"
      onClick={() => (onClick ? onClick() : excelHandler())}
    >
      Excel
    </button>
  );
}
