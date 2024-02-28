import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import StyleForm, { StyleFormType } from "../components/style-form"
import EditForm, {EditFormType} from "../components/style-form/edit"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../hooks/use-notification"
import { FormImage } from "../../../types/shared"
import { prepareImages } from "../../../utils/images"
import useOrganizeData from "../../products/components/organize-form/use-organize-data";
type NewStyleForm = {
  style: StyleFormType,
  style_option: EditFormType[]
}



const EditStyle = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])

  const [allStyles, setStyles] = useState<EditFormType[]>([])
  const [selected, setSelected] = useState(null)
  const getData = async () => {
    const data = await Medusa.customProductStyle.retrieve(id)
    const options_data = await Medusa.customStyleOption.list(100, 1, `custom_style_id=${id}`)
    setStyles(options_data.data.custom_style_options.custom_style_option)
    setItem(data.data.style)
    const sel = (data.data.style[0]?.productCategories?.map((c) => c.id) || []).reduce((acc, val) => {
      acc[val] = true
      return acc
    }, {} as Record<string, true>)
    setSelected(sel)
    setLoading(false)
  }
  const notification = useNotification()
  const categoriesOptions = useOrganizeData("").categoriesOptions

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const style_data = (formData.style)
    try {
      const response = await Medusa.customProductStyle.update(id ,style_data)
     
      formData.style_option.map(async (style) => {
        if (style.title !== "") {
          const { images, style_id, ...rest } = style;

          rest.custom_style_id = id || ""
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
          if (style_id) {
            const resp = await Medusa.customStyleOption.update(style_id ,rest)
          } else {
            if (rest.title !== "") {

                const resp = await Medusa.customStyleOption.create(rest)
            }
          }
        }
      notification("success", "Succesfully Updated", "success")
      await getData()
    })
    
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

  const form = useForm<NewStyleForm>()
  const handleAddForm = () => {
    const newStyle = { title: "", price: "", custom_style_id : "", style_id : "", subtitle : "", images : [], image_url : "" };
    setStyles([...allStyles, newStyle]);
  };
  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(item, allStyles))
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
          path="/a/custom-products?view=custom-style"
          label="Back to Custom Style"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["custom_style"]} type="multiple">
                <Accordion.Item value={"custom_style"} title="Custom Style">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <StyleForm form={nestedForm(form, "style")} categoriesOptions={categoriesOptions} initiallySelected={selected} is_new={false} />
                  </div>
                </Accordion.Item>
                <Accordion.Item value={"styling"} title="Edit Style Option">
                <div className="flex flex-col gap-y-xlarge">
                    <div>
                        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
                    </div> 
                    {allStyles.map((_, index) => (
                        <EditForm
                            key={index}
                            index={index}
                            form={nestedForm(form, `style_option`)}
                            setObjectList={setStyles}
                        />
                  ))}
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

const createExisting = (item: any, allStyles: any[]): NewStyleForm => {
  return {
    style: {
      title: item[0].title || "",
      type: item[0].type || "",
      description: item[0].description || "",
      product_categories: item[0].productCategories?.map((c) => c.id) || []
    },
    style_option: allStyles.map((i) => ({
        style_id: i.id,
        title: i.title,
        price: i.price_adjust,
        custom_style_id: "", 
        images: [], 
        subtitle: "", 
        image_url: i.image_url
    })) || []
  };
};
export default EditStyle
