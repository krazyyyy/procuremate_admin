import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import ColorGroupForm, { ColorGroupFormType } from "../components/color-form"
import { FormImage } from "../../../types/shared";
import { prepareImages } from "../../../utils/images";
type NewColorGroupForm = {
  color_group: ColorGroupFormType,
}



const EditColor = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])



  const getData = async () => {
    const data = await Medusa.customColorGroup.retrieve(id)
    console.log(data.data.custom_color_group)
    setItem(data.data.custom_color_group)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const color_data = (formData.color_group)
    const { images, ...rest } = color_data;
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
      const response = await Medusa.customColorGroup.update(id ,rest)
      console.log(response)
      notification("Success",  "Updated", "success")
      await getData()
      
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
    }

  }

  const form = useForm<NewColorGroupForm>()
  
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
          path="/a/materials?view=color-group "
          label="Back to Color Group"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["custom_color"]} type="multiple">
                <Accordion.Item value={"custom_color"} title="Custom Color">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <ColorGroupForm form={nestedForm(form, "color_group")} />
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

const createExisting = (item: any): NewColorGroupForm => {
  return {
    color_group: {
      title: item?.title || "",
      hex_color: item?.hex_color || "",
      published: item?.published || false,
      image_url: item?.image_url || "",
      images: [],
    }
  };
};
export default EditColor
