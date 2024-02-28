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
export type NamesFormType = {
  id: string | "";
  title: string | "";
  description: string | "";
  internal_description: string | "";
  base_price: string | "";
  price: string | "";
  outline_price: string | "";
  character_limit: string | "";
  can_have_outline: boolean | false;
  can_have_crystals: boolean | false;
  can_have_patch: boolean | false;
  allow_special_finishes: boolean | false;
  optional: boolean | false;
  name_outline_material: string | "";
  patch_price: string | "";
  patch_material: string | "";
  crystal_price: string | "";
  crystal_material: string | "";
  name_fill_materials: string[] | []; // Keep it unchanged
  product_types: string[] | []; // Keep it unchanged
};


type Props = {
  form: NestedForm<NamesFormType[]>
  index: number; // Add the index prop
  key: number; // Add the index prop
  setObjectList: {}
}

const NamesSubForm = ({ key, index, form, setObjectList }: Props) => {
    const getMaterialType = async () => {
        try {
          const data = await Medusa.materialType.list(100, 1);
          const materials = data.data.material_types.material_types;
      
          const options = materials.map((material) => ({
            value: material.id,
            label: material.title || material.name,
          }));
      
          return options;
        } catch (error) {
          console.error("Failed to fetch colors:", error);
          return [];
        }
      };
      const categoriesOptions = useOrganizeData("").categoriesOptions
      const [loading, setLoading] = useState(true);
      const [materialOptions, setMaterialOptions] = useState([]);
      const fetchColors = async () => {
        const options = await getMaterialType();
        setMaterialOptions(options);
        setLoading(false)
      };
      
      useEffect(() => {
        fetchColors();
      }, []);
    if (loading) {
      return null
    }
    
    const notification = useNotification()
    const removeObjectById = (idToRemove: string) => {
      setObjectList((prevList) =>
        prevList.filter((obj) => obj.id !== idToRemove)
      );
    };
    const setting_id = form.getValues().names[index]?.id || ""
    const deleteSettings = async () => {
      if (setting_id !== "") {
        await Medusa.customizerNames.delete(setting_id)
        removeObjectById(setting_id)
        notification("Success", "Removed Settings", "success")
      } 
    }

    const { register, path, setValue, control, formState: { errors } } = form
    
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
            label="Base Price"
            placeholder="Base Price"
            {...register(path(`${index}.base_price`))}
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
            label="Outline Price"
            placeholder="Outline Price"
            {...register(path(`${index}.outline_price`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">
            <InputField
            label="Character Limit"
            placeholder="Character Limit"
            {...register(path(`${index}.character_limit`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">
            <InputField
            label="Crystal Price"
            placeholder="Crystal Price"
            {...register(path(`${index}.crystal_price`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">
            <InputField
            label="Patch Price"
            placeholder="Patch Price"
            {...register(path(`${index}.patch_price`))}
            />
        </div>
        <div className="grid gap-x-large mb-large">

        </div>
        <div className="grid gap-x-large mb-large">
        <InputHeader label="Name Fill Materials" className="mb-2" />
          <Controller
            name={path(`${index}.name_fill_materials`)}
            control={control}
            render={({ field: { value, onChange } }) => {
              const initiallySelected = (value || []).reduce((acc, val) => {
                acc[val] = true
                return acc
              }, {} as Record<string, true>)
              return (
                <NestedMultiselect
                  placeholder={
                    !!materialOptions?.length
                      ? "Color Group"
                      : "No Color Group available"
                  }
                  onSelect={onChange}
                  options={materialOptions}
                  initiallySelected={initiallySelected}
                />
              )
            }}
          />
        </div>
        <div className="grid gap-x-large mb-large">
  <InputHeader label="Name Outline Material" className="mb-2" />
  <Controller
    name={path(`${index}.name_outline_material`)}
    control={control}
    render={({ field }) => (
      <select {...field} className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" onChange={(e) => field.onChange(e.target.value)}>
        <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" value="">Select Material Type</option>
        {materialOptions.map((option) => (
          <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  />
</div>
<div className="mb-2">
      <InputHeader label="Product Type" className="mb-2" />
          <Controller
            name={path(`${index}.product_types`)}
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
      </div>

      <div className="grid gap-x-large mb-large">
      <TextArea
        label="Description"
        placeholder="Your Material Type Description..."
        rows={3}
        className="mb-small"
        {...register(path(`${index}.description`))}
        errors={errors}
      />
      </div>
      <div className="grid gap-x-large mb-large">
      <TextArea
        label="Description"
        placeholder="Your Material Type Description..."
        rows={3}
        className="mb-small"
        {...register(path(`${index}.internal_description`))}
        errors={errors}
      />
      </div>
<div className="grid gap-x-large mb-large">
        <Checkbox
          label="Can Have Crystals"
          {...register(path(`${index}.can_have_crystals`))}
          defaultChecked={form.getValues().names[index].can_have_crystals}
        />
      </div>
<div className="grid gap-x-large mb-large">
        <Checkbox
          label="Can Have Patch"
          {...register(path(`${index}.can_have_patch`))}
          defaultChecked={form.getValues().names[index].can_have_patch}
        />
      </div>
<div className="grid gap-x-large mb-large">
        <Checkbox
          label="Allow Special Finishes"
          {...register(path(`${index}.allow_special_finishes`))}
          defaultChecked={form.getValues().names[index].allow_special_finishes}
        />
      </div>
<div className="grid gap-x-large mb-large">
        <Checkbox
          label="Can Have Outline"
          {...register(path(`${index}.can_have_outline`))}
          defaultChecked={form.getValues().names[index].can_have_outline}
        />
      </div>
<div className="grid gap-x-large mb-large">
        <Checkbox
          label="Optional"
          {...register(path(`${index}.optional`))}
          defaultChecked={form.getValues().names[index].optional}
        />
      </div>
  <div className="grid gap-x-large mb-large">
  <InputHeader label="Crystal Material" className="mb-2" />
  <Controller
    name={path(`${index}.crystal_material`)}
    control={control}
    render={({ field }) => (
      <select {...field} className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" onChange={(e) => field.onChange(e.target.value)}>
        <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" value="">Select Material Type</option>
        {materialOptions.map((option) => (
          <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  />
</div>
  <div className="grid gap-x-large mb-large">
  <InputHeader label="Patch Material" className="mb-2" />
  <Controller
    name={path(`${index}.patch_material`)}
    control={control}
    render={({ field }) => (
      <select {...field} className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" onChange={(e) => field.onChange(e.target.value)}>
        <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" value="">Select Material Type</option>
        {materialOptions.map((option) => (
          <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
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

export default NamesSubForm
