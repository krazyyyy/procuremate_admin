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
import GalleryForm, { GalleryFormType } from "../components/gallery-form"
import { prepareImages } from "../../../utils/images"
import { FormImage } from "../../../types/shared"


type NewGalleryForm = {
    gallery: GalleryFormType
}

type Props = {
  onClose: () => void
}



const NewGallery = ({ onClose }: Props) => {
  const form = useForm<NewGalleryForm>({
    defaultValues: createBlank(),
  })

  const [formCount, setFormCount] = useState(0);

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
      const gallery = (data.gallery)
      const { images_list, ...rest } = gallery;
      if (images_list?.length) {
          let preppedImages: FormImage[] = []
  
          try {
          preppedImages = await prepareImages(images_list)
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
  
          rest.images = urls
      }

      const response = await Medusa.gallery.create(rest)

      closeAndReset()
    
      navigate(`/a/gallery/${data.gallery.handle}`)

      
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
            <Accordion defaultValue={["gallery"]} type="multiple">
              <Accordion.Item
                value={"gallery"}
                title="Gallery"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <GalleryForm
                    form={nestedForm(form, "gallery")}

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
    data: NewGalleryForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewGalleryForm => {
  return {
    gallery: {
      title: "",
      handle: "",
      description: "",
      custom_design_id: "",
      category_id: "",
      product_id: "",
      images: [],
      images_list: []
    }
    
  }
}



export default NewGallery
