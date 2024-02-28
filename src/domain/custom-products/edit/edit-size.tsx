import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import SizingForm, { SizingFormType } from "../components/sizing-form"
import EditForm, {EditFormType} from "../components/sizing-form/edit"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../hooks/use-notification"
import useOrganizeData from "../../products/components/organize-form/use-organize-data";
import { NestedMultiselectOption } from "../../categories/components/multiselect";
type NewSizesForm = {
  sizing: SizingFormType,
  sizes: EditFormType[]
}



const EditSize = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])
  const [selected, setSelected] = useState(null)

  const [allSizes, setSizes] = useState<EditFormType[]>([])

  
  const getData = async () => {
    const data = await Medusa.customSizing.retrieve(id)
    const sizes_data = await Medusa.customProductSizing.list(100, 1, `custom_sizes_id=${id}`)
    setSizes(sizes_data.data.custom_product_sizings.custom_product_sizings)
    setItem(data.data.custom_product_sizing)
    const sel = (data.data.custom_product_sizing[0]?.productCategories?.map((c) => c.id) || []).reduce((acc, val) => {
      acc[val] = true
      return acc
    }, {} as Record<string, true>)
    setSelected(sel)

    setLoading(false)
  }
  const categoriesOptions = useOrganizeData("").categoriesOptions
  
  const notification = useNotification()
  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const sizing_data = (formData.sizing)
    try {
      const response = await Medusa.customSizing.update(id ,sizing_data)
      if (response?.status !== 201) {
        notification("Error",  "Unknown Error", "error")
      }
      formData.sizes.map(async (size) => {
        if (size.title !== "") {
          const { size_id, ...rest } = size;
          if (size_id) {
            rest.custom_sizes_id = id || ""
            const resp = await Medusa.customProductSizing.update(size_id ,rest)
          } else {
            rest.custom_sizes_id = id || ""
            const resp = await Medusa.customProductSizing.create(rest)
          }
        }
      })
      notification("success", "Succesfully Updated", "success")
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
    }
      


  }

  const form = useForm<NewSizesForm>()
  const handleAddForm = () => {
    const newSize = { title: "", price_adjust: "", custom_sizes_id : "", size_id : "" };
    setSizes([...allSizes, newSize]);
  };

  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(item, allSizes))
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
          path="/a/custom-products?view=custom-sizing "
          label="Back to Custom Sizing"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["custom_sizing"]} type="multiple">
                <Accordion.Item value={"custom_sizing"} title="Custom Sizing">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <SizingForm form={nestedForm(form, "sizing")} categoriesOptions={categoriesOptions} initiallySelected={selected} is_new={false}/>
                  </div>
                </Accordion.Item>
                <Accordion.Item value={"sizings"} title="Edit Sizing">
                <div className="flex flex-col gap-y-xlarge">
                    <div>
                        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
                    </div> 
                    {allSizes.map((_, index) => (
                        <EditForm
                            key={index}
                            index={index}
                            form={nestedForm(form, `sizes`)}
                            setObjectList={setSizes}
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

const createExisting = (item: any, allSizes: any[]): NewSizesForm => {
  return {
    sizing: {
      title: item[0].title || "",
      product_categories: item[0].productCategories?.map((c) => c.id) || []
    },
    sizes: allSizes.map((i) => ({
      size_id: i.id,
      title: i.title,
      price_adjust: i.price_adjust,
      custom_sizes_id: "" // Add the custom_sizes_id property here
    })) || []
  };
};
export default EditSize
