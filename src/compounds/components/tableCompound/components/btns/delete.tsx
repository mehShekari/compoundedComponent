import { DeleteButton } from "@components/uiElements/bottons/deleteButton";
import { useTableCompoundActionContext } from "../actions";

export const DeleteComponent = ({ onClick }: { onClick?: (arg: any) => void }) => {
  const { DeleteHandler, row, index } = useTableCompoundActionContext();

  return <>
    <DeleteButton
      showHelp={index === 0}
      onClickHandler={(e) => onClick ? onClick(row) : DeleteHandler(e, row)}
    />
  </>
}
