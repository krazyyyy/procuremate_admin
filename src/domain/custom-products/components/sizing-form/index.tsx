import React, { useState, useEffect} from "react"
import InputField from "../../../../components/molecules/input"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../../components/fundamentals/input-header"
import NestedMultiselect from "../../../categories/components/multiselect"
import useOrganizeData from "../../../products/components/organize-form/use-organize-data"
import { Controller } from "react-hook-form"

export type SizingFormType = {
  title: string
  product_categories: string[] | null
}

type Props = {
  form: NestedForm<SizingFormType>
  categoriesOptions: any | string[] | []
  initiallySelected: any | string[] | []
  is_new: boolean 
}

const SizingForm = ({ form, categoriesOptions, initiallySelected, is_new = false }: Props) => {
    const { register, control, path, setValue } = form

  if (!is_new && initiallySelected === null || categoriesOptions === undefined || categoriesOptions.length === 0) {
    return null
  } else {
  return (
    <div className="mb-40">
  
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
        <hr></hr>
        
    </div>
    
  )
          }
}

export default SizingForm

