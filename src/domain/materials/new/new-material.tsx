import { AdminPostProductsReq } from "@medusajs/medusa"
import { useAdminCreateProduct } from "medusa-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import { useFeatureFlag } from "../../../context/feature-flag"
import useNotification from "../../../hooks/use-notification"
import { FormImage, ProductStatus } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import { prepareImages } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import Medusa from "../../../services/api"
import MaterialForm, { MaterialFormType } from "../components/material-form"


type NewMaterialsForm = {
    materials: MaterialFormType,
}

type Props = {
  onClose: () => void
}



const NewMaterials = ({ onClose }: Props) => {
  const form = useForm<NewMaterialsForm>({
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
      
      const material = (data.materials)
      const { images, ...rest } = material;
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
      const response = await Medusa.customMaterial.create(rest)
     if (response?.status === 201) {
         closeAndReset()
         navigate(`/a/materials/material/${response?.data?.result.id}`)
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
            <Accordion defaultValue={["custom_materials"]} type="multiple">
              <Accordion.Item
                value={"custom_materials"}
                title="Custom Materials"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <MaterialForm
                    form={nestedForm(form, "materials")}

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
    data: NewMaterialsForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewMaterialsForm => {
  return {
    materials: {
      title: "",
      thai_name: "",
      data_uri: "",
      material_type: "",
      price: "",
      customColor: [],
      hex_color: "",
      published: false,
      image_url : "",
      images : []
    }
  }
}



export default NewMaterials
