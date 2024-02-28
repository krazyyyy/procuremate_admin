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
import EmailForm, { EmailFormType } from "../components/email-form";
import { FormImage } from "../../../types/shared";
import { prepareImages } from "../../../utils/images";
type NewEmailForm = {
  email: EmailFormType,

}



const EditEmail = () => {
  const { id } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [item, setItem] = useState([])

 
  const getData = async () => {
    const data = await Medusa.emailTemplate.retrieve(id)
    console.log(data)
    setItem(data.data.email_template)
    setLoading(false)
  }
  const notification = useNotification()

  useEffect(() => {
    getData()
  }, [])
  const onSubmit = async () => {
    const formData = form.getValues();
    const email = (formData.email)
    try {



      const response = await Medusa.gallery.update(id ,email)

      notification("success", "Succesfully Updated", "success")
    
  } catch  (err){
    notification("Error",  "Unknown Error", "error")
    
    }
  }

  const form = useForm<NewEmailForm>()

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
              <Accordion defaultValue={["graphic_details"]} type="multiple">
                <Accordion.Item value={"graphic_details"} title="Graphic Details">
                  <div className="flex flex-col mt-xlarge gap-y-xlarge">
                    <EmailForm form={nestedForm(form, "email")} />
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

const createExisting = (item: any): NewEmailForm => {
  return {
    email: {
      name: item.name || "",
      description: item.description || "",
      type: item.type || "",
    },
  };
};
export default EditEmail
