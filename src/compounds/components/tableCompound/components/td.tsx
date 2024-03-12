import { useTableCompoundContext } from "../tableCompound";
import styles from "../styles/Table.module.css";

const Td = ({ children, row, colSpan, className = "" }: {
  children?: React.ReactNode,
  row: any,
  colSpan?: number,
  className?: string
}) => {
  const { columns } = useTableCompoundContext();

  return <>
    {children && columns && (
      <td colSpan={colSpan || columns?.length + 1 || 1} className={className}>
        {children}
      </td>
    )}

    {!children && columns?.map(_col => {
      return <td key={_col} colSpan={colSpan || 1} className={className}>
        <div key={row[_col]} className="px-2">
          {row[_col] === true ? "✔" : row[_col]}
          <span className={`${styles.separator} mb-[2px]`}></span>
        </div>
      </td>
    })}
  </>
}

Td.displayName = "row-td";
export default Td