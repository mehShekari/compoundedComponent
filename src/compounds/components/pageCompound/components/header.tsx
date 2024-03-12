import React, { useContext, createContext } from 'react';
import useFilterNodeChildren from "../../../hooks/useFilterNodeChildren";
import Actions from "./actions";
import MultiSearch from "./multiSearch";
import SingleSearch from "./singleSearch";
import PageCompoundMultiSearchForm from './multiSearchForm';
import { usePageCompoundContext } from '../pageCompound';

/**
 * *PAGE_COMPOUND_HEADER 
*/

const PageCompoundHeaderContext = createContext({});
export function usePageCompoundHeaderContext() {
  return useContext(PageCompoundHeaderContext);
}

interface IProps {
  children?: React.ReactNode
  wrapperClassName?: string,
  wrapper?: React.ReactNode
}

const PageCompoundHeader = ({ children, wrapperClassName }: IProps) => {
  const { CreateInputs, MultiSearchInputs } = usePageCompoundContext();

  const { FinalChildren } = useFilterNodeChildren({
    children,
    checkDisplayName: "header-",
    defaultsDisplayNames: ['actions', 'singleSearch', 'multiSearch'],
    defaultComponents: [
      <Actions key={"actions"} />,
      <SingleSearch key={"singleSearch"} />,
      (MultiSearchInputs || CreateInputs ? <MultiSearch key={"multiSearch"} /> : null ),
    ]
  })

  return (
    <PageCompoundHeaderContext.Provider value={{}} >
      <div className="bg-white rounded-xl py-2" key={"header"}>
        <div className={`flex flex-nowrap items-center py-0  m-0 justify-between px-3 ${wrapperClassName}`}>
          {FinalChildren}
        </div>
      </div>
      
      <div>
        <PageCompoundMultiSearchForm />
      </div>
    </PageCompoundHeaderContext.Provider>
  )
}

PageCompoundHeader.Actions = Actions;
PageCompoundHeader.SingleSearch = SingleSearch;
PageCompoundHeader.MultiSearch = MultiSearch;

PageCompoundHeader.displayName = "compound-page-header"
export default PageCompoundHeader;

