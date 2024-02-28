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
import SizingForm, {SizingFormType} from "../components/sizing-form"
import GeneralForm, { GeneralFormType } from "../components/general-form"
import Medusa from "../../../services/api"
import EditForm, { EditFormType } from "../components/sizing-form/edit"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import async from "react-select/dist/declarations/src/async/index"
import useOrganizeData from "../../products/components/organize-form/use-organize-data"
type NewSizesForm = {
    sizing: SizingFormType,
    sizes: EditFormType[]
}

type Props = {
  onClose: () => void
}



const NewSizes = ({ onClose }: Props) => {
  const form = useForm<NewSizesForm>({
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

  const categoriesOptions = useOrganizeData("").categoriesOptions
  const onSubmit = () =>
  handleSubmit(async (data) => {
      const payload = data
      const sizing_data = (data.sizing)
      const response = await Medusa.customSizing.create(sizing_data)
     if (response?.data?.status == "success") {
         closeAndReset()
        data.sizes.map(async (size) => {
            if (size.title !== "") {
                size.custom_sizes_id = response?.data?.stat.id
                const { size_id, ...rest } = size;
                const resp = await Medusa.customProductSizing.create(rest)
            }
        })
         navigate(`/a/custom-products/sizing/${response?.data?.stat.id}`)
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
            <Accordion defaultValue={["custom_sizing"]} type="multiple">
              <Accordion.Item
                value={"custom_sizing"}
                title="Custom Sizing"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <SizingForm
                    form={nestedForm(form, "sizing")}
                    categoriesOptions={categoriesOptions} initiallySelected={selected} is_new={true}


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
                            form={nestedForm(form, `sizes`)}
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
    data: NewSizesForm
  ) => {
   
    return ;
  };
  

const createBlank = (): NewSizesForm => {
  return {
    sizing: {
      title: "",
      product_categories: null
    }, 
    sizes :[]
    
  }
}



export default NewSizes
