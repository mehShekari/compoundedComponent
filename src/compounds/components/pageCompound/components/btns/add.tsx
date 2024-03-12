import { AddButton } from "@components/uiElements/bottons/addButton";
import { BtnTypes, usePageCompoundActionsContext } from "../actions"
import CompoundForm from "@components/uiElements/form/compoundForm";
import CallApi from "@services/api/callApi";
import { usePageCompoundContext } from "../../pageCompound";
import { modalState } from "@redux/slices/modalSlice";
import { useAppSelector } from "@hooks/redux";

interface IProps extends BtnTypes { }

export default function AddComponent({ onClick, rest }: IProps) {
  const { schema, controller, createInputProps, CreateInputs, modalTitle, customModalWidth, pinCreate, fetchData } = usePageCompoundContext();
  const { addHandler } = usePageCompoundActionsContext()

  const modal = useAppSelector(modalState);
  if(CreateInputs == null) return;
  return <>
    <AddButton
      onClick={onClick ?? addHandler}
      direction="bottom"
      helpDirection="right"
      rest={rest}
    />
      
    <div className="min-h-0">
      <CompoundForm
        url={schema && controller ? CallApi.url(`${schema}/${controller}/Create/Url`) : CallApi.url(['Create', 'Url'])}
        Inputs={<CreateInputs {...createInputProps} />}
        modalTitle={`تعریف ${modalTitle ? modalTitle : ""}`}
        modalType="add"
        customWidth={customModalWidth}
        havePin={pinCreate}
        submitHandler={(res, _err, reset, close) => {
          if (res) {
            addHandler?.(res?.data)
            fetchData()
            reset()
            if (!pinCreate || !modal.payload?.pin)
              close()
          }
        }}
        isModal
      >
        <CompoundForm.FormBody />
        <CompoundForm.FormFooter />
      </CompoundForm>
    </div>
  </>
}