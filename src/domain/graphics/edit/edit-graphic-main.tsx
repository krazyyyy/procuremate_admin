import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import EditForm, {EditFormType} from "../components/graphic-main-form/edit"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../hooks/use-notification"
import GraphicForm, { GraphicFormType } from "../components/graphic-main-form";
import useOrganizeData from "../../products/components/organize-form/use-organize-data";

type NewGraphicMainForm = {
  graphic: GraphicFormType,
  sizing: EditFormType[]
}



const EditGraphicMain = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])

  const [allSizes, setSizes] = useState<EditFormType[]>([])
  const [selected, setSelected] = useState(null)
  const getData = async () => {
    const data = await Medusa.graphicsMain.retrieve(id)
    const sizes_data = await Medusa.graphicSizes.list(100, 1, `graphic_id=${id}`)
    setSizes(sizes_data.data.graphic_size.graphic_size)
    setItem(data.data.graphic_main)
    const sel = (data.data.graphic_main[0]?.productCategories?.map((c) => c.id) || []).reduce((acc, val) => {
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
    const sizing_data = (formData.graphic)
    try {
      const response = await Medusa.graphicsMain.update(id ,sizing_data)

      formData.sizing.map(async (size) => {
        if (size.title !== "") {
          const { size_id, ...rest } = size;
          if (size_id) {
            rest.graphic_id = id || ""
            const resp = await Medusa.graphicSizes.update(size_id ,rest)
          } else {
            rest.graphic_id = id || ""
            const resp = await Medusa.graphicSizes.create(rest)
          }
        }
      })
      notification("success", "Succesfully Updated", "success")
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
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

  const form = useForm<NewGraphicMainForm>()
  const handleAddForm = () => {
    const newSize = { title: "", price: "", description: "", graphic_id : "", size_id : "" };
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
          path="/a/graphics?view=pricing "
          label="Back to Graphic Pricing"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["graphic_details"]} type="multiple">
                <Accordion.Item value={"graphic_details"} title="Graphic Details">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <GraphicForm form={nestedForm(form, "graphic")} categoriesOptions={categoriesOptions} initiallySelected={selected} is_new={false} />
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
                            form={nestedForm(form, `sizing`)}
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

const createExisting = (item: any, allSizes: any[]): NewGraphicMainForm => {
  return {
    graphic: {
      name: item[0].name || "",
      type: item[0].type || "",
      product_categories: item[0].productCategories?.map((c) => c.id) || []
    },
    sizing: allSizes.map((i) => ({
      size_id: i.id,
      title: i.title,
      description: i.description,
      price: i.price,
      graphic_id: i.graphic_id // Add the custom_sizes_id property here
    })) || []
  };
};
export default EditGraphicMain
