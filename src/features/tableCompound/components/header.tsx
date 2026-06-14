import { useTableCompoundContext } from "../context/tableCompoundContext";

type TableCompoundHeaderProps = {
  children?: React.ReactNode;
};

const TableCompoundHeader = ({ children }: TableCompoundHeaderProps) => {
  const { captions } = useTableCompoundContext();

  return (
    <thead>
      {children ?? (
        <tr>
          {captions.map((caption) => (
            <th key={caption} scope="col" style={{ textAlign: "left" }}>
              <div className="px-2">{caption}</div>
            </th>
          ))}
          <th scope="col" style={{ textAlign: "left" }}>
            <div className="px-2">Actions</div>
          </th>
        </tr>
      )}
    </thead>
  );
};

TableCompoundHeader.displayName = "compound-table-header";
export default TableCompoundHeader;
