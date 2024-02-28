import { useAdminProduct } from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import { getErrorStatus } from "../../../utils/get-error-status"
import GeneralSection from "./sections/general"
import MediaSection from "./sections/media"
import RawSection from "./sections/raw"
import SvgSection from "./sections/svg"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import SeoSection from "../../products/edit/sections/seo"
import ProductSettingsForm from "../components/product-settings-form"
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import async from "react-select/dist/declarations/src/async/index"
import GraphicForm, { GraphicFormType } from "../components/graphic-form"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../hooks/use-notification"
import { FormImage } from "../../../types/shared"
import { prepareImages } from "../../../utils/images"

type NewGraphicForm = {
  graphics: GraphicFormType
}



const EditGraphic = () => {
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])



  const getData = async () => {
    const data = await Medusa.graphics.retrieve(id)
    console.log(data)
    console.log(data.data.graphic)
    setItem(data.data.graphic)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const graphics_data = (formData.graphics)
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
    try {
      const response = await Medusa.graphics.update(id ,rest)
     
      notification("success", "Succesfully Updated", "success")
      await getData()
    
  } catch  (err){
    notification("Error",  err.toSting(), "error")
    
    }
      
  //   data.sizes.map(async (size) => {
  //     if (size.title !== "") {
  //         size.custom_sizes_id = response?.data?.stat.id
  //         console.log(size)
  //         const resp = await Medusa.customProductSizing.create(size)
  //         console.log(resp)
  //     }
  // })

  }

  const form = useForm<NewGraphicForm>()

  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(item))
    }
  }, [isLoading, item])
  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }
 else {
    return (
      <div className="">
        <BackButton
          path="/a/graphics"
          label="Back to Graphics / Logos"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["graphics"]} type="multiple">
                <Accordion.Item value={"graphics"} title="Graphics">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <GraphicForm form={nestedForm(form, "graphics")} />
                  </div>
                </Accordion.Item>

              </Accordion>
              <div className="flex gap-x-small float-right mt-10">   
           <Button
                size="small"
                variant="primary"
                type="button"
                onClick={onSubmit}
              >
                Update
              </Button></div>
            </div>

          </div>

        </div>
      </div>
    )
}
}

const createExisting = (item: any): NewGraphicForm => {
  return {
    graphics: {
      id: item.id || "",
      name: item.name || "",
      type: item.type || "",
      image_url: item.image_url || "",
      images:  []
    },
  };
};
export default EditGraphic
