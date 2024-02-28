import React from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";


export type EditFormType = {
  size_id: string;
  column_one: string;
  column_two: string;
  column_three: string;
  column_four: string;
  size_key: string;
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
          label="Column Value"
          placeholder="Column Value"
          {...register(path(`${index}.column_one`))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Column Value"
          placeholder="Column Value"
          {...register(path(`${index}.column_two`), { // Include the index in the path
            // Add your validation rules here
          })}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Column Value"
          placeholder="Column Value"
          {...register(path(`${index}.column_three`), { // Include the index in the path
            // Add your validation rules here
          })}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Column Value"
          placeholder="Column Value"
          {...register(path(`${index}.column_four`), { // Include the index in the path
            // Add your validation rules here
          })}
        />
      </div>
      <hr />
    </div>
  );
};

export default EditForm;
