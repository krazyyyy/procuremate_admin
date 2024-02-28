import React from "react"
import InputField from "../../../../components/molecules/input"
import { NestedForm } from "../../../../utils/nested-form"
import Medusa from "../../../../services/api"
import { useEffect, useState } from "react"
import NestedMultiselect from "../../../categories/components/multiselect"
import InputHeader from "../../../../components/fundamentals/input-header"
import { Controller } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import TextArea from "../../../../components/molecules/textarea"
import useOrganizeData from "../../../products/components/organize-form/use-organize-data"
import Button from "../../../../components/fundamentals/button"
import useNotification from "../../../../hooks/use-notification"
export type NameFinishFormType = {
  id: string | "";
  title: string | "";
  price: string | "";
  is_three_d: boolean | false
};


type Props = {
  form: NestedForm<NameFinishFormType[]>
  index: number; // Add the index prop
  key: number; // Add the index prop
  setObjectList: {}
}

const NameFinishForm = ({ key, index, form, setObjectList }: Props) => {


    const { register, path, setValue, control, formState: { errors } } = form
    const notification = useNotification()
    const removeObjectById = (idToRemove: string) => {
      setObjectList((prevList) =>
        prevList.filter((obj) => obj.id !== idToRemove)
      );
    };
    const setting_id = form.getValues().finish[index]?.id || ""
    const deleteSettings = async () => {
      if (setting_id !== "") {
        await Medusa.customizerNamesFinishes.delete(setting_id)
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
            label="Price"
            placeholder="Price"
            {...register(path(`${index}.price`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">
            <Checkbox
            label="is 3D?"
            {...register(path(`${index}.is_three_d`))}
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

export default NameFinishForm
