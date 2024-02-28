import React from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";
import Medusa from "../../../../services/api"
import useNotification from "../../../../hooks/use-notification"
import Button from "../../../../components/fundamentals/button";
export type EditFormType = {
    size_id: string;
  title: string;
  price_adjust: string | null;
  custom_sizes_id: string
};

type Props = {
  form: NestedForm<EditFormType[]>;
  index: number; // Add the index prop
  key: number; // Add the index prop
  setObjectList: {}
};

const EditForm = ({ form, index, key, setObjectList }: Props) => {
  const { register, path, setValue, control } = form;
  const removeObjectById = (idToRemove: string) => {
    setObjectList((prevList) =>
      prevList.filter((obj) => obj.id !== idToRemove)
    );
  };
  const notification = useNotification()

  let setting_id
  try {
    setting_id = form?.getValues()?.sizes[index]?.size_id || ""
  } catch {
    setting_id = ""
  }

  const deleteSettings = async () => {
    if (setting_id !== "") {
      await Medusa.customProductSizing.delete(setting_id)
      removeObjectById(setting_id)
      notification("Success", "Removed Settings", "success")
    } 
  }
  return (
    <div className="mb-4" key={key}>
      <div className="grid mb-large">
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
          {...register(path(`${index}.price_adjust`), { // Include the index in the path
            // Add your validation rules here
          })}
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
      <hr />
    </div>
  );
};

export default EditForm;
