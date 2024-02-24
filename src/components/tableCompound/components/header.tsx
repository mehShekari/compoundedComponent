import React from "react";

const TableCompoundHeader = ({ children }: { children?: React.ReactNode }) => {
    return <thead>
        {children && children}
        {!children && <tr>
            <th style={{ textAlign: "left" }}>
                <div className="px-2" >header 1</div>
            </th>

            <th>
                <div className="px-2">hader 2</div>
            </th>
            
            <th>
                <div className="px-2">actions</div>
            </th>
        </tr>}
    </thead>
}

TableCompoundHeader.displayName = "compound-table-header";
export default TableCompoundHeader;