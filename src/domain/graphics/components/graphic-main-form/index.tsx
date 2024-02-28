import React from "react"
import InputField from "../../../../components/molecules/input"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../../components/fundamentals/input-header"
import NestedMultiselect from "../../../categories/components/multiselect"
import useOrganizeData from "../../../products/components/organize-form/use-organize-data"
import { Controller } from "react-hook-form"

export type GraphicFormType = {
  name: string
  type: string
  product_categories: string[] | null
}

type Props = {
  form: NestedForm<GraphicFormType>
  categoriesOptions: any | string[] | []
  initiallySelected: any | string[] | []
  is_new: boolean 
}

const GraphicForm = ({ form, categoriesOptions, initiallySelected, is_new = false }: Props) => {
    const { register, control, path, setValue } = form

  if (!is_new && initiallySelected === null || categoriesOptions === undefined || categoriesOptions.length === 0) {
    return null
  } else {
  return (
    <div>
  
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Title"
          placeholder="New Item"
          required
          {...register(path("name"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
        />
      </div>
     
      <div>
      <InputHeader label="Categories" className="mb-2" />
          <Controller
            name={path("product_categories")}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <NestedMultiselect
                  placeholder={
                    !!categoriesOptions?.length
                      ? "Choose categories"
                      : "No categories available"
                  }
                  onSelect={onChange}
                  options={categoriesOptions}
                  initiallySelected={initiallySelected}
                />
              )
            }}
          />
      </div>
      <div className="grid gap-x-large mb-large">
      <InputHeader label="Type" className="mb-2" />
          <Controller
            name={path("type")}
            control={control}
            render={({ field: { onChange, value } }) => (
              <select className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                onChange={(e) => onChange(e.target.value)}
                value={value}
              >
                <option value="">Select Type</option>
                <option value="Graphic">Graphic</option>
                <option value="Sport">Sport</option>
                <option value="Festive">Festive</option>
                <option value="Patriotic">Patriotic</option>
                <option value="Custom Graphic">Custom Graphic</option>
                <option value="Flag">Flag</option>
                <option value="Logo">Logo</option>
              </select>
            )}
          />
      </div>
        <hr></hr>
        
    </div>
    
  )
}
}

export default GraphicForm
