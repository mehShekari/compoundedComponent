import { useContext, createContext, useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

import PageCompoundHeader from "./components/header";
import PageCompoundBody from "./components/body";
import PageCompoundFooter from "./components/footer";
import useFilterNodeChildren from "../../hooks/useFilterNodeChildren";
import { PageCompoundContextTypes, PageCompoundTypes } from "./types/pageCompoundTest";
import usePageHeader from "@hooks/usePageHeader";
import useFetchPagedData from "@hooks/useFetchPagedData";
import { useClearModal } from "@components/pages/tablePageCompound";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import PageCompoundCollapseHeader from "./components/collapseHeader";
import ErrorBoundary from "../../utils/errorBoundary";

/**
 * * PAGE_COMPOUND 
*/

const appear = keyframes`
  from{
    transform: translateY(-7px);
    opacity: 0;
  } to {
    transform: translateY(0px);
    opacity: 1;
  }
`

const Wrapper = styled.div`
  .children_animated_wrapper
  {
    animation: ${appear} 200ms normal ease-out;
  }
`

const PageCompoundContext = createContext({} as PageCompoundContextTypes);
export function usePageCompoundContext() {
  return useContext(PageCompoundContext)
}


function PageCompound(props: PageCompoundTypes) {
  const {
    children,
    editInputs: EditInputs,
    createInputs: CreateInputs,
    multiSearchInputs: MultiSearchInputs,
    editInputProps,
    createInputProps,
    schema,
    controller,
    modalTitleName,
    multiSearchProps = {},
    GetPageAndRecordCountPath,
    GetListByPagingPropsPath,
    params,
    className,
    customModalWidth,
    pin: pinCreate = true
  } = props;

  const { FinalChildren } = useFilterNodeChildren({
    children,
    checkDisplayName: "compound-page-",
    defaultsDisplayNames: ['header', 'body', 'footer'],
    defaultComponents: [
      <PageCompoundHeader key={"header"} />,
      <PageCompoundBody key={"body"} />,
      <PageCompoundFooter key={"footer"} />
    ]
  })
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10);
  const [singleSearch, setSingleSearch] = useState<string>("");
  const [multipleSearch, setMultipleSearch] = useState<any[]>(
    Object.entries(multiSearchProps).map(([column, search]) => ({
      column,
      search,
      match: true
    }))
  )
  const [toggleCollapse, setToggleCollapse] = useState<'' | 'MultiSearch' | 'Add' | 'Edit'>('')
  const [sort, setSort] = useState({
    asc: false,
    sortOrder: ""
  })

  useEffect(() => {
    setPage(1)
  }, [singleSearch, params, pageSize, sort])

  const path = usePageHeader()

  const { data, pageCount, totalRecords, fetchData, loader, headerData, headerEnData, setData } = useFetchPagedData(
    //* set custom schema and controller or read url from window.location.pathname
    schema && controller ? `${schema}/${controller}` : [],
    true,
    {
      // * deps
      pageSize: pageSize,
      page: page,
      singleSearch: singleSearch,
      sortOrder: sort.sortOrder,
      asc: sort.asc,
      multipleSearch
    },
    GetPageAndRecordCountPath,
    GetListByPagingPropsPath,
    params
  );

  const setMultipleSearchHandler = (value: object) => {
    const searchList: any[] = []

    if (multiSearchProps) {
      Object.entries(multiSearchProps).forEach(([column, search]) => {
        searchList.push({
          column,
          search,
          match: true
        })
      })
    }

    Object.entries(value).forEach(([column, search]) => {
      if (search && search?.length > 0) {
        if (searchList.find(search => search.column === column)) return
        searchList.push({
          column,
          search,
        })
      }
    })
    setMultipleSearch(searchList)
  }

  //* to show animation just for once in first render
  const render = useRef(false)
  const [prevRender, setPrevRerender] = useState(0)

  useEffect(() => {
    if (loader) return
    if (!render.current && prevRender === 0) {
      setPrevRerender(1)
      render.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

  useClearModal()

  return <ErrorBoundary fallBack={(message) => <>{message}</>}>
    <PageCompoundContext.Provider value={{
      pageCount, totalRecords,
      schema, controller,
      EditInputs, CreateInputs,
      MultiSearchInputs: MultiSearchInputs ?? CreateInputs,
      editInputProps, createInputProps,
      data, setData,
      page, setPage,
      pageSize, setPageSize,
      singleSearch, setSingleSearch,
      sort, setSort,
      headerEnData, headerData,
      loader, fetchData,
      modalTitle: modalTitleName ? modalTitleName : path?.name_,
      multipleSearch, setMultipleSearch: setMultipleSearchHandler,
      toggleCollapse, setToggleCollapse,
      customModalWidth, pinCreate
    }}>
      <Wrapper className={`flex flex-col gap-1 ${className}`}>
        {loader && prevRender === 0 && <div className="px-3">
          <SkeletonTheme baseColor="#e6e6e6" highlightColor="#bebebe">
            <p>
              <Skeleton count={1} width={"100%"} height={"40px"} style={{ minWidth: "500px" }} />
              <Skeleton count={1} width={"100%"} height={"150px"} />
            </p>
          </SkeletonTheme>
        </div>}

        <div className={`children_animated_wrapper flex flex-col gap-1 ${loader && prevRender === 0 ? "hidden" : "flex"}`}>
          {FinalChildren}
        </div>
      </Wrapper>
    </PageCompoundContext.Provider>
  </ErrorBoundary>
}

PageCompound.Header = PageCompoundHeader;
PageCompound.CollapseHeader = PageCompoundCollapseHeader;
PageCompound.Body = PageCompoundBody;
PageCompound.Footer = PageCompoundFooter;

export default PageCompound