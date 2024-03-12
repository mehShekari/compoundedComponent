import FileMangerComponent from "@components/pages/tablePageCompound/components/fileManager"
import useExcelHandler from "@components/pages/tablePageCompound/components/useExcel"
import ModalContainer from "@components/shared/modal"
import MainButton from "@components/uiElements/bottons/main/mainButton"
import Tooltip from "@components/uiElements/tooltip"
import { RiFileExcel2Line } from "react-icons/ri"
import { BtnTypes } from "../actions"

interface IProps extends BtnTypes {}

export default function ExcelComponent ({ onClick, rest }: IProps)
{
    const { click } = useExcelHandler()

    return <>
      <MainButton
        className="w-[25px] h-[25px]"
        color="green"
        bg={100}
        bgH={400}
        border={400}
        // onClick={() => dispatch(toggleModal({ type: "excel", status: true}))}
        onClick={onClick ?? click}
        rest={rest}
      >
        <RiFileExcel2Line size={15} />
        <Tooltip content={"دانلود فایل اکسل جدول"} direction={'bottom'} helpDirection="left" />
      </MainButton>
  
      <ModalContainer modalType="excel" direction="bottom" title="فایل" customWidth="600px">
        <FileMangerComponent />
      </ModalContainer>
    </>
}