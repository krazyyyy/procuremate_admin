import React from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";
import Checkbox from "../../../../components/atoms/checkbox";
import TextArea from "../../../../components/molecules/textarea";

export type MaterialTypeFormType = {
  title: string;
  description: string;
};

type Props = {
  form: NestedForm<MaterialTypeFormType>;
};

const MaterialTypeForm = ({ form }: Props) => {
  const { register, path, setValue, formState: { errors } } = form;
  return (
    <div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Title"
          placeholder="New Item"
          required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
        />
      </div>
      <div className="grid gap-x-large mb-large">
      <TextArea
        label="Description"
        placeholder="Your Material Type Description..."
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      </div>
      <hr />
    </div>
  );
};

export default MaterialTypeForm;
