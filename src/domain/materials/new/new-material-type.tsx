import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import Medusa from "../../../services/api"
import MaterialTypeForm, { MaterialTypeFormType } from "../components/material-type-form"
type NewMaterialTypeForm = {
    material_type: MaterialTypeFormType,
}

type Props = {
  onClose: () => void
}



const NewMaterialType = ({ onClose }: Props) => {
  const form = useForm<NewMaterialTypeForm>({
    defaultValues: createBlank(),
  })

  const navigate = useNavigate()
  const notification = useNotification()



  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form

  const closeAndReset = () => {
    reset(createBlank())
    onClose()
  }

  useEffect(() => {
    reset(createBlank())
  }, [])

  
  const onSubmit = () =>
  handleSubmit(async (data) => {
      const payload = data
      const color_data = (data.material_type)
      const response = await Medusa.materialType.create(color_data)
     if (response?.status === 201) {
         closeAndReset()
         navigate(`/a/materials/type/${response?.data?.result.id}`)
      } else {
          notification("Error", getErrorMessage("Error"), "error")
      }
      
    })

  return (
    <form className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="flex justify-between w-full px-8 medium:w-8/12">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={closeAndReset}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="flex gap-x-small">
              <Button
                size="small"
                variant="primary"
                type="button"
                disabled={!isDirty}
                onClick={onSubmit()}
              >
                Publish
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="flex justify-center w-full no-scrollbar">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] my-16">
            <Accordion defaultValue={["material_type"]} type="multiple">
              <Accordion.Item
                value={"material_type"}
                title="Materials Type"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <MaterialTypeForm
                    form={nestedForm(form, "material_type")}

                  />

                </div>
              </Accordion.Item>
              
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

  

const createBlank = (): NewMaterialTypeForm => {
  return {
    material_type: {
      title: "",
      description: ""
    }
  }
}



export default NewMaterialType
