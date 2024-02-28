import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../hooks/use-notification"
import GalleryForm, { GalleryFormType } from "../components/gallery-form";
import { FormImage } from "../../../types/shared";
import { prepareImages } from "../../../utils/images";
type NewGalleryForm = {
  gallery: GalleryFormType,

}



const EditGallery = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])

 
  const getData = async () => {
    const data = await Medusa.gallery.retrieve(id)
    setItem(data.data.gallery)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const gallery = (formData.gallery)
    try {
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
      const response = await Medusa.gallery.update(id ,rest)

      notification("success", "Succesfully Updated", "success")
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
    }
  }

  const form = useForm<NewGalleryForm>()

  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(item))
    }
  }, [isLoading])
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
          path="/a/gallery"
          label="Back to Gallery"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["gallery_details"]} type="multiple">
                <Accordion.Item value={"gallery_details"} title="Gallery Details">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <GalleryForm form={nestedForm(form, "gallery")} />
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

const createExisting = (item: any): NewGalleryForm => {
  return {
    gallery: {
      title: item?.title || "",
      description: item?.description || "",
      handle: item?.handle|| "",
      custom_design_id: item?.custom_design_id?.id || "",
      category_id: item?.category_id?.id || "",
      product_id: item?.product_id?.id || "",
      images: item?.images || [],
      images_list: [],
    },
  };
};
export default EditGallery
