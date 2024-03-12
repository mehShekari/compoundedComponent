import { useContext, createContext } from "react";

import TableCompoundActions from "./actions";
import TableCompoundRow from "./row";
import { usePageCompoundContext } from "../../pageCompound/pageCompound";
import CompoundForm from "@components/uiElements/form/compoundForm";
import CallApi from "@services/api/callApi";
import AreYouSure from "@components/shared/areYouSure";
import { useAppSelector } from "@hooks/redux";
import { getDynamicModalStatus } from "@redux/slices/dynamicModal";


/**
 * *TABLE COMPOUND BODY 
*/

interface MyComponentProps {
  filter?: (item: any) => boolean | any;
  children?: (args: any) => any
  data?: any[]
}

const TableCompoundBodyContext = createContext({});
export function useTableCompoundBodyContext() {
  return useContext(TableCompoundBodyContext)
}

const TableCompoundBody = ({ filter = () => true, children }: MyComponentProps) => {
  const { data, toggleCollapse } = usePageCompoundContext();

  return (
    <TableCompoundBodyContext.Provider value={{}}>
      <tbody>
        {
          data?.filter(filter)?.map((_row, _index) => children ? children({
            item: _row,
            index: _index,
            Row: TableCompoundRow,
            collapseStatus: toggleCollapse
          }) : <TableCompoundRow key={_index} row={_row} index={_index} />)
        }
      </tbody>
      <DefaultModals />
    </TableCompoundBodyContext.Provider>
  )
}

TableCompoundBody.Row = TableCompoundRow;
TableCompoundBody.Action = TableCompoundActions;

TableCompoundBody.displayName = "compound-table-body";
export default TableCompoundBody;


const DefaultModals = () => {
  const {
    editInputProps, EditInputs, 
    modalTitle, customModalWidth, 
    fetchData, schema, controller
  } = usePageCompoundContext();
  const dynamicModalStatus = useAppSelector(getDynamicModalStatus);
  const path = schema && controller ? `${schema}/${controller}/Edit/Url` : ["Edit", "Url"]

  return <>
    {EditInputs && <CompoundForm
      url={CallApi.url(path)}
      Inputs={EditInputs ? <EditInputs {...editInputProps} /> : <></>}
      modalType="edit"
      modalTitle={`ویرایش ${modalTitle}`}
      customWidth={customModalWidth}
      isModal
      editMode
      submitHandler={(res, err, reset, close) => {
        if (res?.data) {
          fetchData()
          // setBodyData?.(editItem(res.data, (bodyData ?? data) || [], setData))
          reset()
          close()
        } else {
          console.error(err)
        }
      }}
    >
      <CompoundForm.FormBody />
      <CompoundForm.FormFooter />
    </CompoundForm>}

    {/* delete modal */}
    <AreYouSure
      type="delete-detail"
      url={["Delete"]}
      id={dynamicModalStatus.payload && dynamicModalStatus.payload.id}
      handleDelete={(_, id) => {
        if (id) {
          fetchData()
          // setBodyData?.(deleteItem(id, (bodyData ?? data) || [], setData))
        }
      }}
    />
  </>
}