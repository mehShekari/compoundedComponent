import { SetStateAction, useState } from "react";

import PageCompound, { usePageCompoundContext } from "@components/pages/compounds/components/pageCompound/pageCompound";
import TableCompound from "@components/pages/compounds/components/tableCompound/tableCompound"
import { PageCompoundTypes } from "../types";
import ModalContainer from "@components/shared/modal";
import CompoundForm from "@components/uiElements/form/compoundForm";
import CallApi from "@services/api/callApi";
import { useAppSelector } from "@hooks/redux";
import { modalState } from "@redux/slices/modalSlice";

type WithDetailPropsTypes = {
  detailSchema: string
  detailController: string
  detailCreateInputs: JSX.ElementType
  detailEditInputs: JSX.ElementType
  modalLabelName: string,
  filterSearchProps: number | string
}

export default function WithDetailPage(props: PageCompoundTypes & WithDetailPropsTypes) {
  const {
    createInputs, editInputs,
    detailSchema, detailController, 
    detailCreateInputs: DetailCreateInputs, detailEditInputs,
    modalLabelName, filterSearchProps
  } = props
  const [editRow, setEditRow] = useState<any>(null)

  const handleEdit = async (row: object) => {
    if ('id' in row) {
      const res = await CallApi.url(`${detailSchema}/${detailController}/GetForEdit`, {}, {}, { id: row.id })
      if (res?.data) {
        setEditRow(res?.data);
      }
    }
  }

  const modalStatus = useAppSelector(modalState);

  return <>
    <PageCompound createInputs={createInputs} editInputs={editInputs}>
      <PageCompound.Body>
        <TableCompound>
          <TableCompound.Body>
            {({ index, item }) => {
              return <TableCompound.Body.Row index={index} key={index}>
                <TableCompound.Body.Row.Td row={item} />
                <TableCompound.Body.Row.Actions row={item} index={index}>
                  {({ DeleteBtn, EditBtn, DetailBtn }) => <>
                    <DetailBtn />
                    <EditBtn />
                    <DeleteBtn />
                  </>}
                </TableCompound.Body.Row.Actions>
              </TableCompound.Body.Row>
            }}
          </TableCompound.Body>
        </TableCompound>
      </PageCompound.Body>
    </PageCompound>

    <ModalContainer title={` جزئیات ${modalStatus.payload?.[modalLabelName] || modalStatus.itemByid?.[modalLabelName] || ""}`} modalType={'details'} direction={'top'} customWidth={'95%'} fullScreen>
      <PageCompound
        schema={detailSchema} controller={detailController}
        createInputs={() => <DetailCreateInputs parentId={modalStatus.payload?.id} />} editInputs={detailEditInputs}
        multiSearchProps={{ [filterSearchProps]: modalStatus.payload?.id }}
      >
        <PageCompound.CollapseHeader key={"header"} />
        <PageCompound.Body>
          <TableCompound>
            <TableCompound.Body>
              {({ item, index, collapseStatus }) => {
                if (item.id === editRow?.id && collapseStatus === "Edit") {
                  return <TableCompound.Body.Row index={index} >
                    <TableCompound.Body.Row.Td row={item}>
                      <EditForm
                        schema={detailSchema}
                        controller={detailController}
                        EditInputs={detailEditInputs}
                        editItem={editRow}
                        setEditItem={setEditRow}
                      />
                    </TableCompound.Body.Row.Td>
                  </TableCompound.Body.Row>
                }
                else return <TableCompound.Body.Row index={index} >
                  <TableCompound.Body.Row.Td row={item} />
                  <TableCompound.Body.Row.Actions index={item} row={item}>
                    {({ EditBtn, DeleteBtn }) => {
                      return <>
                        <CollapseEditWrapper>
                          <EditBtn onClick={handleEdit} />
                        </CollapseEditWrapper>
                        <DeleteBtn />
                      </>
                    }}
                  </TableCompound.Body.Row.Actions>
                </TableCompound.Body.Row>
              }}
            </TableCompound.Body>
          </TableCompound>
        </PageCompound.Body>
      </PageCompound>
    </ModalContainer>
  </>
}

type EditFormTypes = {
  schema: string
  controller: string
  EditInputs: JSX.ElementType
  editItem: object
  setEditItem: React.Dispatch<SetStateAction<object>>
}

const CollapseEditWrapper = ({ children }: { children: React.ReactNode }) =>
{
  const { setToggleCollapse } = usePageCompoundContext();

  return <div onClick={() => setToggleCollapse("Edit")}>
    {children}
  </div> 
}

const EditForm = ({ schema, controller, EditInputs, editItem, setEditItem }: EditFormTypes) => {
  const { fetchData } = usePageCompoundContext();
  return <div className="p-2 bg-slate-200 rounded-md">
    <CompoundForm
      url={`${schema}/${controller}/Edit`}
      Inputs={<EditInputs id={1} />}
      editItem={editItem}
      submitHandler={(res, err, reset) => {
        if (res.data) {
          fetchData()
          reset()
          setEditItem({ id: -1 });
        } else {
          console.log(err)
        }
      }}
      onCancel={() => setEditItem({ id: -1 })}
    >
      <CompoundForm.FormBody />
      <CompoundForm.FormFooter />
    </CompoundForm>
  </div>
}