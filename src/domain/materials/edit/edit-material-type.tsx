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
import MaterialTypeForm, { MaterialTypeFormType } from "../components/material-type-form";

type NewMaterialTypeForm = {
  material_type: MaterialTypeFormType,
}



const EditMaterialType = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])



  const getData = async () => {
    const data = await Medusa.materialType.retrieve(id)
    setItem(data.data.material_type)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const material_type = (formData.material_type)
    try {
      const response = await Medusa.materialType.update(id ,material_type)
      notification("Success",  "Updated", "success")
      
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
    }

  }

  const form = useForm<NewMaterialTypeForm>()
  
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
          path="/a/materials?view=materials-type"
          label="Back to Materials Type"
          className="mb-xsmall"
        />
        <div className="grid gap-x-base ">
          <div className="col-span-8 flex flex-col gap-y-xsmall ">
            <div className="bg-white my-16 p-5">
              <Accordion defaultValue={["custom_color"]} type="multiple">
                <Accordion.Item value={"custom_color"} title="Custom Color">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <MaterialTypeForm form={nestedForm(form, "material_type")} />
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

const createExisting = (item: any): NewMaterialTypeForm => {
  return {
    material_type: {
      title: item[0].title || "",
      description: item[0].description || ""
    }
  };
};
export default EditMaterialType
