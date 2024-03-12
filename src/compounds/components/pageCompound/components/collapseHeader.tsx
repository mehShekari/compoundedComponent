import { useState } from "react"

import { CollapseDefault } from "@components/uiElements/collapse/collapseDefault"
import PageCompound, { usePageCompoundContext } from "../pageCompound"
import CallApi from "@services/api/callApi"
import PinButton from "@components/uiElements/bottons/pinButton"
import CompoundForm from "@components/uiElements/form/compoundForm"
import { AddButton } from "@components/uiElements/bottons/addButton"
import PageCompoundMultiSearchForm from "./multiSearchForm"

const PageCompoundCollapseHeader = ({ className }: { className?: string }) => {
  const {
    pinCreate,
    schema, controller,
    toggleCollapse, setToggleCollapse,
    CreateInputs, createInputProps,
    fetchData,
  } = usePageCompoundContext()

  const [pined, setPined] = useState<boolean>(false)


  return <div className="bg-white rounded-xl">
    <CollapseDefault show={toggleCollapse === 'Add'}>
      <div className={`${className} flex items-center py-0 m-2 justify-between`}>
        <div className="flex gap-2 mr-2">
          <AddButton direction="bottom" helpDirection="top" onClick={() => setToggleCollapse(prev => prev === 'Add' ? '' : 'Add')} />
          <PageCompound.Header.Actions.Print />
          <PageCompound.Header.Actions.Excel />
        </div>
        <PageCompound.Header.SingleSearch />
        <div className="mx-2 mr-28">
          <PageCompound.Header.MultiSearch />
        </div>
      </div>
      <div>
        <PageCompoundMultiSearchForm />
      </div>

      <CollapseDefault.Body >
        <div className='p-2'>
          {pinCreate && <PinButton pin={pined} onClick={() => setPined(prev => !prev)} />}
          <CompoundForm
            url={schema && controller ? `${schema}/${controller}/Create` : CallApi.url(['Create', 'Url'])}
            Inputs={<CreateInputs {...createInputProps} />}
            editItem={{}}
            submitHandler={(res, err, reset) => {
              if (res.data) {
                fetchData()
                reset()
                if (!pined)
                  setToggleCollapse('')
              } else {
                console.log(err)
              }
            }}
            onCancel={(reset) => {
              setToggleCollapse('')
              reset()
            }}
          >
            <CompoundForm.FormBody />
            <CompoundForm.FormFooter />
          </CompoundForm>
        </div>
      </CollapseDefault.Body>
    </CollapseDefault>
  </div>
}



PageCompoundCollapseHeader.displayName = "compound-page-header"

export default PageCompoundCollapseHeader