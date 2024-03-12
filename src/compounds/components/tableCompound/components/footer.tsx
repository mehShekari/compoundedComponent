import { usePageCompoundContext } from "../../pageCompound/pageCompound";

import { useEffect, useState } from "react";
import styles from "../styles/Table.module.css";
import { SelectList } from "@components/uiElements/inputs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MainButton from "@components/uiElements/bottons/main/mainButton";
import Tooltip from "@components/uiElements/tooltip";
import { useTableCompoundContext } from "../tableCompound";

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

interface Page {
  page: number,
  pageSize: number,
  totalRecords: number,
  onChangePage: (...arg: any) => void,
  onChangePageSize: (value: number) => void
}

const TableCompoundFooter = () => {
  const [totalPage, setTotalPage] = useState(1);
  const { totalRecords, page, pageSize, setPage, setPageSize } = usePageCompoundContext()
  const { columns = [] } = useTableCompoundContext()
  useEffect(() => {
    setTotalPage(Math.ceil(totalRecords / pageSize));
  }, [totalRecords, pageSize])

  function pagingHandler(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= totalPage) {
      setPage(pageNumber);
    }
  }

  return <tfoot>
    <tr>
      <td colSpan={columns?.length + 1}>
        <div className={`${styles.paging}`} key={pageSize}>
          <div className="ml flex items-center gap-2">
            {"نمایش"}
            <SelectList
              className="col-auto scale-90"
              options={pageSizeOptions}
              value={pageSize}
              onChange={(e: any) => {
                setPageSize(e.value)
              }}
              menuPlacement="top"
              key={pageSize}
            />
            <Tooltip content="تعداد نمایش" direction="left" />
            {`از ${totalRecords?.toLocaleString("fa-IR")}`}
          </div>

          <MainButton
            className={`!p-3 text-base !rounded-full ${(page - 1 > 0) ? 'hover:text-primary' : ''}`}
            color="grey"
            disabled={(page - 1 <= 0)}
            onClick={() => pagingHandler(page - 1)}
          >
            <IoIosArrowBack />
            <Tooltip content="صفحه قبلی" direction="top" />
          </MainButton>

          {[...Array(totalPage)]?.map((_e, i) => {
            if (
              (i + 1 <= page + 2 && i + 1 >= page - 2) ||
              i + 1 < 2 ||
              i + 1 > totalPage - 1
            ) {
              return (
                <MainButton
                  className={`!w-10 !h-10 !rounded-full text-base align-middle ${(page === i + 1) ? '' : 'hover:text-primary'}`}
                  color={(page === i + 1) ? 'blue' : 'grey'}
                  onClick={() => pagingHandler(i + 1)}
                  bg={(page === i + 1) ? 50 : 200}
                  disabled={(page === i + 1)}
                  key={i + 1}
                >
                  {i + 1}
                </MainButton>
              );
            } else if (
              (i + 1 > page + 2 || i + 1 < page - 2) &&
              (i + 1 === page + 3 || i + 1 === page - 3)
            ) {
              return (
                <div
                  className={`${styles.pagingItem} text-center align-middle`}
                  key={i + 1}
                >
                  ...
                </div>
              );
            }
          })}

          <MainButton
            className={`!p-3 !rounded-full text-base ${(page + 1 <= totalPage) ? 'hover:text-primary' : ''}`}
            color="grey"
            disabled={(page + 1 > totalPage)}
            onClick={() => pagingHandler(page + 1)}
          >
            <IoIosArrowForward />
            <Tooltip content="صفحه بعدی" direction="top" />
          </MainButton>

        </div>
      </td>

    </tr>
  </tfoot>
}


TableCompoundFooter.displayName = "compound-table-footer"
export default TableCompoundFooter;