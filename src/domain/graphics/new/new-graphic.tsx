
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import useNotification from "../../../hooks/use-notification"
import { FormImage, ProductStatus } from "../../../types/shared"
import { prepareImages } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import Medusa from "../../../services/api"
import GraphicForm, {GraphicFormType} from "../components/graphic-form"



type NewGraphicsForm = {
    graphics: GraphicFormType,
}

type Props = {
  onClose: () => void
}



const NewStyles = ({ onClose }: Props) => {
  const form = useForm<NewGraphicsForm>({
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
      console.log(payload)
      const graphics_data = (data.graphics)
      const { id, images, ...rest } = graphics_data
      if (images?.length) {
        let preppedImages: FormImage[] = []

        try {
        preppedImages = await prepareImages(images)
        } catch (error) {
        let errorMessage =
            "Something went wrong while trying to upload the thumbnail."
        const response = (error as any).response as Response

        if (response.status === 500) {
            errorMessage =
            errorMessage +
            " " +
            "You might not have a file service configured. Please contact your administrator"
        }

        notification("Error", errorMessage, "error")
        return
        }
        const urls = preppedImages.map((image) => image.url)

        rest.image_url = urls[0]
    }

      const response = await Medusa.graphics.create(rest)
      console.log(response)
      closeAndReset()
      navigate(`/a/graphics/graphic/${response?.data?.stat.id}`)

      
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
            <Accordion defaultValue={["graphics"]} type="multiple">
              <Accordion.Item
                value={"graphics"}
                title="Graphics"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <GraphicForm
                    form={nestedForm(form, "graphics")}

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

const createPayload = (
    data: NewGraphicsForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewGraphicsForm => {
  return {
    graphics: {
      id: "",
      image_url: "",
      images: [],
      name: "",
      type: "",
    }   
  }
}



export default NewStyles
