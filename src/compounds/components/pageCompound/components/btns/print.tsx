import { useRef } from "react";
import { usePageCompoundContext } from "../../pageCompound";
import MainButton from "@components/uiElements/bottons/main/mainButton";
import { AiFillPrinter } from "react-icons/ai";
import Tooltip from "@components/uiElements/tooltip";
import PrintTable from "@components/print/table";
import { BtnTypes } from "../actions";

interface IProps extends BtnTypes {}

export default function PrintComponent({ bodyData, onClick, rest }: IProps & { bodyData?: any }) {
    const { schema, controller } = usePageCompoundContext();
    const clickRef = useRef<any>(null)
  
    return (
      <>
        <MainButton
          className="w-[25px] h-[25px]"
          color="grey"
          border={400}
          bg={200}
          onClick={() => onClick?.() ?? clickRef.current.click()}
          rest={rest}
        >
          <AiFillPrinter size={15} />
          <Tooltip content="پرینت" direction="bottom" helpDirection="bottom" />
          <PrintTable schema={schema} controller={controller} boyData={bodyData} ref={clickRef} />
        </MainButton>
      </>
    )
}