import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import useNotification from "../../../hooks/use-notification"
import { nestedForm } from "../../../utils/nested-form"
import Medusa from "../../../services/api"
import EditForm, { EditFormType } from "../components/size-guide-form/edit"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import SizeGuideForm, { SizeGuideFormType } from "../components/size-guide-form"

type NewSizeGuideForm = {
    guide: SizeGuideFormType,
    sizing: EditFormType[]
}

type Props = {
  onClose: () => void
}



const NewSizeGuide = ({ onClose }: Props) => {
  const form = useForm<NewSizeGuideForm>({
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
      const sizing_data = (data.guide)
      const response = await Medusa.sizeGuide.create(sizing_data)
      console.log(response)
         closeAndReset()
        data.sizing.map(async (size) => {
                size.size_key = response?.data?.id
                const resp = await Medusa.sizeColumn.create(size)
           
        })
         navigate(`/a/size-guide/${response?.data?.id}`)
   
      
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
                  <SizeGuideForm
                    form={nestedForm(form, "guide")}

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
    data: NewSizeGuideForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewSizeGuideForm => {
  return {
    guide: {
      column_one: "",
      column_two: "",
      column_three: "",
      column_four: "",
      type:"",
      category_id: "",
    }, 
    sizing :[]
    
  }
}



export default NewSizeGuide
