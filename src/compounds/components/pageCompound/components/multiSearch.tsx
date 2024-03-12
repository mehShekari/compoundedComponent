import MainButton from "@components/uiElements/bottons/main/mainButton";
import { usePageCompoundContext } from "../pageCompound";
import { IoClose } from "react-icons/io5";
import { MdOutlineManageSearch } from "react-icons/md";
import Tooltip from "@components/uiElements/tooltip";

const MultiSearch = () => {
  const { toggleCollapse, setToggleCollapse } = usePageCompoundContext()
  return <div className="mx-2 mr-28">
    <MainButton
      variant="outline"
      color="blue"
      className="!p-1 [&>svg]:hover:text-white w-8 h-8"
      onClick={() => setToggleCollapse(prev => prev === 'MultiSearch' ? '' : 'MultiSearch')}
    >
      {toggleCollapse === 'MultiSearch' ?
        <IoClose className='w-5 h-5' />
        :
        <MdOutlineManageSearch size={25} className="w-5 h-5" />
      }
      <Tooltip content={toggleCollapse === 'MultiSearch' ? "بستن" : "جستجو پیشرفته"} direction="right" />
    </MainButton>
  </div>
}
MultiSearch.displayName = "header-multiSearch";
export default MultiSearch 