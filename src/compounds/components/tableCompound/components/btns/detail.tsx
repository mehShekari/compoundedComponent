import { DetailsButton } from "@components/uiElements/bottons/detailsButton";
import { useTableCompoundActionContext } from "../actions";

export const DetailComponent = ({ onClick }: { onClick?: (arg: any) => void }) => {
  const { detailHandler, row, index } = useTableCompoundActionContext();

  return <DetailsButton
    helpDirection="right"
    showHelp={index == 0}
    onClickHandler={() => onClick ? onClick(row) : detailHandler(row)}
  />

}