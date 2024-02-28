import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import EditForm, {EditFormType} from "../components/size-guide-form/edit"
import { nestedForm } from "../../../utils/nested-form"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../hooks/use-notification"
import SizeGuideForm, { SizeGuideFormType } from "../components/size-guide-form";

type NewSizeGuideForm = {
  guide: SizeGuideFormType,
  sizing: EditFormType[]
}



const EditSizeGuide = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])

  const [allSizes, setSizes] = useState<EditFormType[]>([])

  const getData = async () => {
    const data = await Medusa.sizeGuide.retrieve(id)

    const sizes_data = await Medusa.sizeColumn.list(100, 1, `size_key=${id}`)
    setSizes(sizes_data.data.size_value.size_value)
    setItem(data.data.size_guide)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const sizing_data = (formData.guide)
    try {
      const response = await Medusa.sizeGuide.update(id ,sizing_data)

      formData.sizing.map(async (size) => {
        const { size_id,  ...rest } = size;
        if (size_id) {
          const {size_key, ...rest1} = rest
            const resp = await Medusa.sizeColumn.update(size_id ,rest1)
          } else {
            rest.size_key = id || ""
            const resp = await Medusa.sizeColumn.create(rest)
          }
      })
      notification("success", "Succesfully Updated", "success")
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
    }
  }

  const form = useForm<NewSizeGuideForm>()
  const handleAddForm = () => {
    const newSize = { column_one: "", column_two: "", column_three: "", column_four : "", size_key : "", size_id : "" };
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
          path="/a/size-guide"
          label="Back to Size Guide"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["size_guide"]} type="multiple">
                <Accordion.Item value={"size_guide"} title="Size Guide">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <SizeGuideForm form={nestedForm(form, "guide")} />
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

const createExisting = (item: any, allSizes: any[]): NewSizeGuideForm => {
  return {
    guide: {
      column_one: item[0].column_one || "",
      column_two: item[0].column_two || "",
      column_three: item[0].column_three || "",
      column_four: item[0].column_four || "",
      type: item[0].type || "",
      category_id: item[0].category_id?.id || ""
    },
    sizing: allSizes.map((i) => ({
      size_id: i.id,
      column_one: i.column_one,
      column_two: i.column_two,
      column_three: i.column_three,
      column_four: i.column_four,
      size_key: "" // Add the custom_sizes_id property here
    })) || []
  };
};
export default EditSizeGuide
