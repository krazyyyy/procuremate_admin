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
import MaterialForm, {MaterialFormType} from "../components/material-form";
import { FormImage } from "../../../types/shared";
import { prepareImages } from "../../../utils/images";
type NewMaterialsForm = {
  materials: MaterialFormType,
}



const EditMaterial = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])



  const getData = async () => {
    const data = await Medusa.customMaterial.retrieve(id)
    setItem(data.data.custom_material)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const color_data = (formData.materials)
    try {
      const {images, ...rest} = color_data
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
      const response = await Medusa.customMaterial.update(id ,rest)
      notification("Success",  "Updated", "success")
      await getData()

    
  } catch  (err){ 
    
    notification("Error",  err.toString(), "error")
    
    }

  }

  const form = useForm<NewMaterialsForm>()
  
  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(item));
    }
  }, [isLoading, item]);
  
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
          path="/a/materials"
          label="Back to Materials"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["custom_material"]} type="multiple">
                <Accordion.Item value={"custom_material"} title="Custom Material">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <MaterialForm form={nestedForm(form, "materials")} />
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

const createExisting = (item: any): NewMaterialsForm => {
  return {
    materials: {
      title: item[0].title || "",
      thai_name: item[0].thai_name || "",
      price: item[0].price || "",
      data_uri: item[0].data_uri || "",
      material_type: item[0].material_type || "",
      image_url: item[0].image_url || "",
      customColor: item[0].customColor.map((i) => i.id) || [],
      hex_color: item[0].hex_color || "",
      published: item[0].published || false,
      images: [],
    }
  };
};
export default EditMaterial
