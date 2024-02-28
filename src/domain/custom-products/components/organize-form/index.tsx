import React from "react"
import { Controller } from "react-hook-form"
import {
  NextCreateableSelect,
  NextSelect,
} from "../../../../components/molecules/select/next-select"
import TagInput from "../../../../components/molecules/tag-input"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import useOrganizeData from "../../../products/components/organize-form/use-organize-data"
import InputHeader from "../../../../components/fundamentals/input-header"
import NestedMultiselect from "../../../categories/components/multiselect"
import { Required } from "../../../../components/molecules/input/input.stories"
export type OrganizeFormType = {
  type: Option | null
  collection: Option | null
  tags: string[] | null
  categories: string[] | null
}

type Props = {
  form: NestedForm<OrganizeFormType>
}

const OrganizeForm = ({ form }: Props) => {
  const { control, path, setValue } = form
  const { productTypeOptions, collectionOptions, categoriesOptions = [] } = useOrganizeData("Custom")

  const typeOptions = productTypeOptions
  // console.log(categoriesOptions, form.getValues()?.organize?.categories)
  const onCreateOption = (value: string) => {
    typeOptions.push({ label: value, value })
    setValue(
      path("type"),
      { label: value, value },
      {
        shouldDirty: true,
      }
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <Controller
          name={path("collection")}
          control={control} 
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label="Collection"
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder="Choose a collection"
                isClearable
              />
            )
          }}
        />
      </div>
      <>
          <InputHeader label="Categories" className="mb-2" />
          <Controller
            name={path("categories")}
            control={control}
            render={({ field: { value, onChange } }) => {
              const initiallySelected = (value || []).reduce((acc, val) => {
                acc[val] = true
                return acc
              }, {} as Record<string, true>)
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
        </>
      <div className="mb-large" />
      <Controller
        control={control}
        name={path("tags")}
        render={({ field: { value, onChange } }) => {
          return <TagInput onChange={onChange} values={value || []} />
        }}
      />
      
    </div>
  )
}

export default OrganizeForm
