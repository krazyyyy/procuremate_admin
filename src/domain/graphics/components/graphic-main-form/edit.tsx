import React from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";


export type EditFormType = {
    size_id: string;
    title: string;
    description: string;
    price: string | null;
    graphic_id: string
};

type Props = {
  form: NestedForm<EditFormType[]>;
  index: number; // Add the index prop
  key: number; // Add the index prop
};

const EditForm = ({ form, index, key }: Props) => {
  const { register, path, setValue, control } = form;


  return (
    <div className="mb-4" key={key}>
      <div className="grid  gap-x-large mb-large">
        <InputField
          label="Title"
          placeholder="New Item"
          {...register(path(`${index}.title`))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Description"
          placeholder="Description"
          {...register(path(`${index}.description`), { // Include the index in the path
            // Add your validation rules here
          })}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Price"
          placeholder="Price"
          {...register(path(`${index}.price`), { // Include the index in the path
            // Add your validation rules here
          })}
        />
      </div>
      <hr />
    </div>
  );
};

export default EditForm;
