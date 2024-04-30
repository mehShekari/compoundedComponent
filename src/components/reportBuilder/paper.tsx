import React, { LegacyRef, forwardRef } from "react";
import styled from "styled-components";
import useDrag from "./helper/useDragHandler";

const Paper = styled.div`
    width: 210mm; 
    height: 297mm;
    min-width: 210mm;
    background: rgba(255, 255, 255, 0.3);
`

interface IProps {
    children?: React.ReactNode,
}


const PaperComponent = (props: IProps, ref: LegacyRef<HTMLDivElement> | undefined) => 
{
    const { children } = props;

    const { handleMouseMove } = useDrag({
        parentRefClassName: "parentRef_1"
    })

    return <Paper ref={ref} className="parentRef_1" onMouseMove={(e:any) => handleMouseMove(e)}>
        {children}
    </Paper>
}

export default forwardRef(PaperComponent);