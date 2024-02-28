import React from "react"
import InputField from "../../../../components/molecules/input"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../../components/fundamentals/input-header"
import useOrganizeData from "../../../products/components/organize-form/use-organize-data"
import { Controller } from "react-hook-form"

export type SizeGuideFormType = {
  column_one: string
  column_two: string
  column_three: string
  column_four: string
  type: string
  category_id: string
}

type Props = {
  form: NestedForm<SizeGuideFormType>
}

const SizeGuideForm = ({ form }: Props) => {
    const { register, control, path, setValue } = form

  const categoriesOptions = useOrganizeData("").categoriesOptions


  return (
    <div>
  
      <div className="grid gap-x-large mb-large">
        <InputField
          label="First Column"
          placeholder="First Column"
          {...register(path("column_one"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Second Column"
          placeholder="Second Column"
          {...register(path("column_two"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Third Column"
          placeholder="Third Column"
          {...register(path("column_three"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Forth Column"
          placeholder="Forth Column"
          {...register(path("column_four"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Type"
          placeholder="Type"
          {...register(path("type"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
  <InputHeader label="Category" className="mb-2" />
  <Controller
    name={path("category_id")}
    control={control}
    render={({ field }) => (
      <select {...field} className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" onChange={(e) => field.onChange(e.target.value)}>
        <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" value="">Select Category</option>
        {categoriesOptions.map((option) => (
          <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  />
</div>
     
        <hr></hr>
        
    </div>
    
  )
}

export default SizeGuideForm
