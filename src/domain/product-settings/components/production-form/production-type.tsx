import React, { useEffect, useState } from "react";
import InputField from "../../../../components/molecules/input";
import { NestedForm } from "../../../../utils/nested-form";
import Checkbox from "../../../../components/atoms/checkbox";
import useNotification from "../../../../hooks/use-notification"
import Button from "../../../../components/fundamentals/button"
import Medusa from "../../../../services/api"
export type ProductionTypeFormType = {
  id: string;
  title: string;
  description: string;
  price: string;
  days: string;
  email_title: string;
  express_shipping: boolean | false
};

type Props = {
  form: NestedForm<ProductionTypeFormType[]>;
  index: number; // Add the index prop
  key: number; // Add the index prop
  setObjectList: {}
};

const ProductionTypeForm = ({ key, index, form, setObjectList }: Props) => {

  const { register, path, setValue, control } = form;
  const notification = useNotification()
  const removeObjectById = (idToRemove: string) => {
    setObjectList((prevList) =>
      prevList.filter((obj) => obj.id !== idToRemove)
    );
  };
  let setting_id
  try {
    setting_id = form?.getValues()?.production_type[index]?.id || ""
  } catch {
    setting_id = ""
  }
  const deleteSettings = async () => {
    if (setting_id !== "") {
      await Medusa.productionType.delete(setting_id)
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
          label="description"
          placeholder="Description"
          {...register(path(`${index}.description`))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Number of days"
          placeholder="Number of days"
          {...register(path(`${index}.days`))}
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
        <InputField
          label="Email Title"
          placeholder="Email Title"
          {...register(path(`${index}.email_title`))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <Checkbox
          label="Express Shipping?"
          {...register(path(`${index}.express_shipping`))}
          defaultChecked={form.getValues().production_type[index].express_shipping}
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
  );
};

export default ProductionTypeForm;
