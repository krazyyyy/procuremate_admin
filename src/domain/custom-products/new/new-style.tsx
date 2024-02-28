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
import GeneralForm, { GeneralFormType } from "../components/general-form"
import Medusa from "../../../services/api"
import EditForm, { EditFormType } from "../components/style-form/edit"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import async from "react-select/dist/declarations/src/async/index"
import StyleForm, { StyleFormType} from "../components/style-form"
import useOrganizeData from "../../products/components/organize-form/use-organize-data"
type NewStylesForm = {
    style: StyleFormType,
    style_option: EditFormType[]
}

type Props = {
  onClose: () => void
}



const NewStyles = ({ onClose }: Props) => {
  const form = useForm<NewStylesForm>({
    defaultValues: createBlank(),
  })

  const [formCount, setFormCount] = useState(0);

  const handleAddForm = () => {
    setFormCount(formCount + 1);
  };
  const navigate = useNavigate()
  const notification = useNotification()
  const categoriesOptions = useOrganizeData("").categoriesOptions


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
      const style_data = (data.style)
      const response = await Medusa.customProductStyle.create(style_data)
     if (response?.data?.status == "success") {

        data.style_option.map(async (style) => {
            if (style.title !== "") {
                const { images, ...rest } = style;
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

                rest.custom_style_id = response?.data?.stat.id
                const resp = await Medusa.customStyleOption.create(rest)

            }
        })
            closeAndReset()
            navigate(`/a/custom-products/style/${response?.data?.stat.id}`)
      } else {
          notification("Error", getErrorMessage("Error"), "error")
      }
      
    })
    const [selected, setSelected] = useState(null)
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
            <Accordion defaultValue={["custom_style"]} type="multiple">
              <Accordion.Item
                value={"custom_style"}
                title="Custom Style"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <StyleForm
                    form={nestedForm(form, "style")}
                    categoriesOptions={categoriesOptions} initiallySelected={selected} is_new={true}

                  />

                </div>
              </Accordion.Item>
              <Accordion.Item
                value={"styling"}
                title="Edit Style Option"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <div>
                        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
                    </div> 
                    {Array.from({ length: formCount }).map((_, index) => (
                        <EditForm
                            key={index}
                            index={index}
                            form={nestedForm(form, `style_option`)}
                            setObjectList={{}}
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
    data: NewStylesForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewStylesForm => {
  return {
    style: {
      title: "",
      product_categories: null,
      type: "",
      description: ""
    }, 
    style_option :[]
    
  }
}



export default NewStyles
