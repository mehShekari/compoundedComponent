import React from "react";
import { useTableCompoundContext } from "../tableCompound";

const TableCompoundHeader = ({ children }: { children?: React.ReactNode }) => {
    const { captions } = useTableCompoundContext();

    return <thead>
        {children && children}
        {!children && <tr>
            {
                captions.map(_cap =>
                {
                    return  <th style={{ textAlign: "left" }} key={_cap}>
                    <div className="px-2" >{_cap}</div>
                </th>
                })
            }
             <th style={{ textAlign: "left" }}><div className="px-2" >action</div></th>
        </tr>}
    </thead>
}

TableCompoundHeader.displayName = "compound-table-header";
export default TableCompoundHeader;