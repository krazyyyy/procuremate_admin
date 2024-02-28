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

export type NameCrystalFormType = {
  id: string | "";
  description: string | "";
  price: string | "";
  material_type: string | "";
};


type Props = {
  form: NestedForm<NameCrystalFormType>
}

const NameCrystalForm = ({ form }: Props) => {
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

    const { register, path, setValue, control, formState: { errors } } = form
    
    return (
        <div>
    
        <div className="grid gap-x-large mb-large">
            <InputField
            label="Price"
            placeholder="Price"
            {...register(path(`price`))}
            />
        </div>

        <div className="grid gap-x-large mb-large">
  <InputHeader label="Name Outline Material" className="mb-2" />
  <Controller
    name={path(`material_type`)}
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
      <TextArea
        label="Description"
        placeholder="Your Material Type Description..."
        rows={3}
        className="mb-small"
        {...register(path(`description`))}
        errors={errors}
      />
      </div>

            <hr></hr>
            
        </div>
        
    )
}

export default NameCrystalForm
