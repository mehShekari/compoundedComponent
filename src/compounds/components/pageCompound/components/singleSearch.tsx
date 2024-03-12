import { useEffect } from "react"
import { usePageCompoundContext } from "../pageCompound"
import SingleSearch from "@components/singleSearch"

interface IProps {
    singleSearchProps?: (value: string) => string | void,
    autoFocuse?: boolean,
    defaultValue?: string | null
}

const SingleSearchComp = ({ autoFocuse, defaultValue, singleSearchProps }: IProps) =>
{
    const { setSingleSearch } = usePageCompoundContext()
    const singleSearchHandler = (value: string) => {
      setSingleSearch(singleSearchProps?.(value) ?? '')
    }
  
    useEffect(() => {
      if (typeof defaultValue === 'string')
        singleSearchHandler('')
    }, [defaultValue])
  
    return <div className="mr-auto">
      <SingleSearch onSearchHandler={singleSearchHandler} autoFocuse={autoFocuse} defaultValue={defaultValue} />
    </div>
}
SingleSearchComp.displayName = "header-singleSearch";
export default SingleSearchComp