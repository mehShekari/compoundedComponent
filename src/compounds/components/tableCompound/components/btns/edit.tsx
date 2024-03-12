import { EditButton } from "@components/uiElements/bottons/editButton";
import { useTableCompoundActionContext } from "../actions";

export const EditComponent = ({ onClick }: { onClick?: (arg: any) => void }) => {
  const { editHandler, row, index } = useTableCompoundActionContext();

  return <>
    <EditButton
      onClickHandler={() => onClick ? onClick(row) : editHandler(row)}
      showHelp={index === 0}
      helpDirection="bottom"
    />
  </>
}
