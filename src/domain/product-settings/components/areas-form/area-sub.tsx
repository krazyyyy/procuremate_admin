import React from "react"
import InputField from "../../../../components/molecules/input"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import Checkbox from "../../../../components/atoms/checkbox"
import useNotification from "../../../../hooks/use-notification"
import Button from "../../../../components/fundamentals/button"
import Medusa from "../../../../services/api"
export type AreasFormType = {
  id: string
  title: string
  price_adjust : string | ""
  optional : boolean | false
}

type Props = {
  form: NestedForm<AreasFormType[]>
  index: number; // Add the index prop
  key: number; // Add the index prop
  setObjectList: {}
}

const AreasSubForm = ({ key, index, form, setObjectList }: Props) => {
    const { register, path, setValue } = form
    const notification = useNotification()
    const removeObjectById = (idToRemove: string) => {
      setObjectList((prevList) =>
        prevList.filter((obj) => obj.id !== idToRemove)
      );
    };
    // const setting_id = form?.getValues()?.areas[index]?.id || ""
    let setting_id
    try {
      setting_id = form?.getValues()?.areas[index]?.id || ""
    } catch {
      setting_id = ""
    }
    // const setting_id =  ""
    const deleteSettings = async () => {
      if (setting_id !== "") {
        await Medusa.customizerAreas.delete(setting_id)
        removeObjectById(setting_id)
        notification("Success", "Removed Settings", "success")
      } 
    }
    return (
        <div key={key}>
    
        <div className="grid gap-x-large mb-large">
            <InputField
            label="Title"
            placeholder="New Item"
            {...register(path(`${index}.title`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">
            <InputField
            label="Price Adjust"
            placeholder="Price Adjust"
            {...register(path(`${index}.price_adjust`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">
            <Checkbox
            label="Optional"
            {...register(path(`${index}.optional`))}
            //   defaultChecked={form.getValues().materials.published}
            />
        </div>
        <div className="grid grid-small gap-x-large mb-large">
      { setting_id !== "" && 
      <Button
      size="small"
      variant="danger"
      type="button"
      className="float-right mt-2"
      onClick={deleteSettings}
    >
      Delete
    </Button>
}
    </div>
            <hr></hr>
            
        </div>
        
    )
}

export default AreasSubForm
