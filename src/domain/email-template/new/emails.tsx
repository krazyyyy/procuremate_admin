import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import useNotification from "../../../hooks/use-notification"
import { nestedForm } from "../../../utils/nested-form"
import Medusa from "../../../services/api"
import EmailForm, { EmailFormType } from "../components/email-form"


type NewEmailForm = {
    email: EmailFormType
}

type Props = {
  onClose: () => void
}



const NewEmail = ({ onClose }: Props) => {
  const form = useForm<NewEmailForm>({
    defaultValues: createBlank(),
  })

  const [formCount, setFormCount] = useState(0);

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

  
  const onSubmit = () =>
  handleSubmit(async (data) => {
      const payload = data
      const email = (data.email)

      const response = await Medusa.emailTemplate.create(email)

      closeAndReset()
    
      navigate(`/a/email-template/${response?.data?.id}`)

      
    })

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
            <Accordion defaultValue={["Emails"]} type="multiple">
              <Accordion.Item
                value={"Emails"}
                title="Emails"
              >
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <EmailForm
                    form={nestedForm(form, "email")}

                  />

                </div>
              </Accordion.Item>
  
              
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}


const createBlank = (): NewEmailForm => {
  return {
    email: {
      name: "",
      description: "",
      type: ""
    }
    
  }
}



export default NewEmail
