import React, { useState } from "react";
import { useTableCompoundContext } from "../tableCompound";
import { usePageCompoundContext } from "../../pageCompound/pageCompound";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";

const TableCompoundHeader = ({ children, onClick }: { children?: React.ReactNode, onClick?: (args: any) => void }) => {
  const { setSort } = usePageCompoundContext()
  const { captions, columns } = useTableCompoundContext();
  const [orderAsc, setOrderAsc] = useState(true);
  const [active, setActive] = useState<number | null>(null);

  const onClickHandler = (index: number) => {
    if (columns) {
      if (active === index) {
        setOrderAsc(prev => !prev)
        onClick?.({ sortOrder: columns[index], asc: orderAsc })
        !onClick && setSort({ sortOrder: columns[index], asc: orderAsc })
      } else {
        setOrderAsc(false);
        onClick?.({ sortOrder: columns[index], asc: orderAsc })
        !onClick && setSort({ sortOrder: columns[index], asc: orderAsc });
        setActive(index);
      }
    }
  };

  return <thead>
    {children && children}
    {!children && <tr>
      {
        captions?.map((_cap, index) => {
          return <th key={_cap} onClick={() => onClickHandler(index)} className={`rounded-lg cursor-pointer hover:bg-slate-200 ${index === active ? "bg-slate-200" : ""}`}>
            <div className="flex justify-center items-center gap-2">
              {_cap}
              <i className={`w-[1px]`} style={{ top: "13px" }}>
                {active !== index ? ""
                  : orderAsc === false ? <FaSortAmountUp className="fill-primary" />
                    : <FaSortAmountDownAlt className="fill-primary" />}
              </i>
            </div>

          </th>
        })
      }
      <th className="w-[1px]"><div className="pl-3">{"عملیات"}</div></th>
    </tr>}
  </thead>
}

TableCompoundHeader.displayName = "compound-table-header";
export default TableCompoundHeader;