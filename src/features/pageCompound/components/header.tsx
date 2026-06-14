import useFilterNodeChildren from "../../hooks/useFilterNodeChildren";
import Actions from "./actions";
import MultiSearch from "./multiSearch";
import SingleSearch from "./singleSearch";
import { COMPOUND_BORDER_STYLE } from "../../constants/defaultTableConfig";

const HEADER_DEFAULT_SLOTS = [
  <MultiSearch key="multiSearch" />,
  <SingleSearch key="singleSearch" />,
  <Actions key="actions" />,
];

const PageCompoundHeader = ({ children }: { children?: React.ReactNode }) => {
  const { finalChildren } = useFilterNodeChildren({
    children,
    checkDisplayName: "header-",
    defaultsDisplayNames: ["multiSearch", "singleSearch", "actions"],
    defaultComponents: HEADER_DEFAULT_SLOTS,
  });

  return (
    <div
      style={{
        ...COMPOUND_BORDER_STYLE,
        padding: "5px",
        marginBottom: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
      }}
    >
      {finalChildren}
    </div>
  );
};

PageCompoundHeader.Actions = Actions;
PageCompoundHeader.SingleSearch = SingleSearch;
PageCompoundHeader.MultiSearch = MultiSearch;

PageCompoundHeader.displayName = "compound-page-header";
export default PageCompoundHeader;
