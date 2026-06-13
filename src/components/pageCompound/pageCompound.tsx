import { useMemo, useState } from "react";

import PageCompoundHeader from "./components/header";
import PageCompoundBody from "./components/body";
import PageCompoundFooter from "./components/footer";
import { PageCompoundContext } from "./context/pageCompoundContext";
import { TableDataContext } from "../tableCompound/context/tableDataContext";
import useFilterNodeChildren from "../../hooks/useFilterNodeChildren";
import ErrorBoundary from "../../utils/errorBoundary";
import FallBack from "../../utils/fallback";
import { DEFAULT_USER_DATA } from "../../constants/defaultTableConfig";
import type { UserRow } from "../../types/page.types";

export { usePageCompoundContext } from "./context/pageCompoundContext";

const PAGE_COMPOUND_DEFAULT_SLOTS = [
  <PageCompoundHeader key="header" />,
  <PageCompoundBody key="body" />,
  <PageCompoundFooter key="footer" />,
];

type PageCompoundProps = {
  children?: React.ReactNode;
  initialData?: UserRow[];
};

function PageCompound({ children, initialData = [...DEFAULT_USER_DATA] }: PageCompoundProps) {
  const [data, setData] = useState<UserRow[]>(initialData);

  const pageContextValue = useMemo(
    () => ({ data, setData }),
    [data, setData],
  );

  const tableDataValue = useMemo(
    () => ({ data, setData }),
    [data, setData],
  );

  const { finalChildren } = useFilterNodeChildren({
    children,
    checkDisplayName: "compound-page-",
    defaultsDisplayNames: ["header", "body", "footer"],
    defaultComponents: PAGE_COMPOUND_DEFAULT_SLOTS,
  });

  return (
    <ErrorBoundary fallBack={(message) => <FallBack message={message} />}>
      <PageCompoundContext.Provider value={pageContextValue}>
        <TableDataContext.Provider value={tableDataValue}>
          {finalChildren}
        </TableDataContext.Provider>
      </PageCompoundContext.Provider>
    </ErrorBoundary>
  );
}

PageCompound.Header = PageCompoundHeader;
PageCompound.Body = PageCompoundBody;
PageCompound.Footer = PageCompoundFooter;

export default PageCompound;
