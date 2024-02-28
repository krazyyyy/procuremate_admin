import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"

import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import Medusa from "../../../services/api"
import EditForm, { EditFormType } from "../components/graphic-main-form/edit"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import GraphicForm, { GraphicFormType } from "../components/graphic-main-form"

type NewGraphicMainForm = {
    graphic: GraphicFormType,
    sizing: EditFormType[]
}

type Props = {
  onClose: () => void
}



const NewGraphicMain = ({ onClose }: Props) => {
  const form = useForm<NewGraphicMainForm>({
    defaultValues: createBlank(),
  })

  const [formCount, setFormCount] = useState(0);

  const handleAddForm = () => {
    setFormCount(formCount + 1);
  };
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
      const sizing_data = (data.graphic)
      const response = await Medusa.graphicsMain.create(sizing_data)
    
     if (response?.data?.status == "success") {
         closeAndReset()
        data.sizing.map(async (size) => {
            if (size.title !== "") {
                size.graphic_id = response?.data?.stat.id
                const { size_id, ...rest } = size;
                const resp = await Medusa.graphicSizes.create(rest)
            }
        })
         navigate(`/a/graphics/pricing/${response?.data?.stat.id}`)
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
            <Accordion defaultValue={["graphic_details"]} type="multiple">
              <Accordion.Item
                value={"graphic_details"}
                title="Graphic Details"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <GraphicForm
                    form={nestedForm(form, "graphic")}

                  />

                </div>
              </Accordion.Item>
              <Accordion.Item
                value={"sizings"}
                title="Edit Sizing"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <div>
                        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
                    </div> 
                    {Array.from({ length: formCount }).map((_, index) => (
                        <EditForm
                            key={index}
                            index={index}
                            form={nestedForm(form, `sizing`)}
                        />
                  ))}
                </div>
              </Accordion.Item>
              
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (
    data: NewGraphicMainForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewGraphicMainForm => {
  return {
    graphic: {
      name: "",
      type:"",
      product_categories: null
    }, 
    sizing :[]
    
  }
}



export default NewGraphicMain
