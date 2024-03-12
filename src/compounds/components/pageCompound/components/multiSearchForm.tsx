import MainButton from "@components/uiElements/bottons/main/mainButton";
import { useRef } from "react";
import { inlineLabelSizeEnum } from "src/types";
import CompoundForm from "@components/uiElements/form/compoundForm";
import CallApi from "@services/api/callApi";
import { useFormContext } from "react-hook-form";
import { usePageCompoundContext } from "../pageCompound";

interface MutliSearchTypes {
  children?: React.ReactNode,
  className?: string
  inputContainerClassName?: string
  inlineLabelSize?: inlineLabelSizeEnum
}

export default function PageCompoundMultiSearchForm(props: MutliSearchTypes) {
  const { className } = props
  const { MultiSearchInputs, setMultipleSearch, toggleCollapse, schema, controller } = usePageCompoundContext();
  const formRef = useRef<HTMLDivElement>(null)

  const onsubmit = (value: any) => {
    setMultipleSearch(value)
  }
  if(CallApi.url(['Create', 'Url']) == null) return
  return (
    <>
      <CompoundForm
        url={schema && controller ? `${schema}/${controller}/Create` : CallApi.url(['Create', 'Url'])}
        Inputs={<div></div>}
        onFinish={onsubmit}
        getInputParameters={inputParameters =>
          inputParameters.map(item => {
            if (item.attributeInfos.find(attribute => ['basicCode', 'url'].includes(attribute.name)))
              item.dataType = 'text'
            item.attributeInfos = []
            return item
          })
        }
      >
        <div
          ref={formRef}
          className={`outline-2 overflow-hidden bg-white rounded-xl transition-all duration-300 ${className} grid px-3 ${toggleCollapse === 'MultiSearch' ? "grid-rows-[1fr] py-3" : "grid-rows-[0fr] py-0"}`}
          onTransitionEnd={e => {
            const element = e.target as Element;
            if (formRef.current && element.matches("div")) {
              if (toggleCollapse === 'MultiSearch') {
                formRef.current.style.overflow = "auto"
              }
              formRef.current.style.overflow = "hidden"
            }
          }}
        >
          <div className="min-h-0">
            {MultiSearchInputs && <MultiSearchInputs />}

            <div className="flex items-center justify-center gap-4 mt-4">
              <MainButton type="submit" variant="contained" className="!text-sm !font-normal !py-[.37rem] !px-4">
                جستجو
              </MainButton>
              <ResetBtn />
            </div>
          </div>
        </div>
      </CompoundForm>
    </>
  )
}

const ResetBtn = () => {
  const { reset } = useFormContext()

  return (
    <MainButton type="submit" variant="outline" className="!text-sm !font-normal !py-[.37rem] !px-4"
      color="grey"
      onClick={() => reset()}
    >
      پاک کردن
    </MainButton>
  )
}