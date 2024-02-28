import React, { useEffect, useState } from "react";
import InputField from "../../../../components/molecules/input";
import { NestedForm } from "../../../../utils/nested-form";
import Medusa from "../../../../services/api";
import NestedMultiselect from "../../../categories/components/multiselect";
import InputHeader from "../../../../components/fundamentals/input-header";
import { Controller } from "react-hook-form";
import Button from "../../../../components/fundamentals/button";
import useNotification from "../../../../hooks/use-notification";
export type ColorFormType = {
  id: string;
  title: string;
  material_type: string[] | [] | null;
};

type Props = {
  form: NestedForm<ColorFormType[]>;
  index: number; // Add the index prop
  key: number; // Add the index prop
  setObjectList: {}
};

const ColorSubForm = ({ key, index, form, setObjectList }: Props) => {
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



  const [materialOptions, setMaterialOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchColors = async () => {
    const options = await getMaterialType();
    setMaterialOptions(options);
    setIsLoading(false);
  };

  

  useEffect(() => {
    fetchColors();
  }, []);
  const { register, path, setValue, control } = form;
  
  if (isLoading) {
    // Render a loading state or return null while fetching the material options
    return null;
  }
  
  
  const notification = useNotification()
  const removeObjectById = (idToRemove: string) => {
    setObjectList((prevList) =>
      prevList.filter((obj) => obj.id !== idToRemove)
    );
  };
  const setting_id = form.getValues().colors[index]?.id || ""
  const deleteSettings = async () => {
    if (setting_id !== "") {setting_id
      await Medusa.customizerColorGroup.delete(setting_id)
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
      <div className="grid gap-x-large mb-large"></div>
      <div className="grid gap-x-large mb-large">
        <InputHeader label="Material Type" className="mb-2" />
        <Controller
          name={path(`${index}.material_type`)}
          control={control}
          defaultValue={[]}
          render={({ field }) => {
            const { onChange, value } = field;
            const initiallySelected = (value || []).reduce((acc, val) => {
              acc[val] = true;
              return acc;
            }, {} as Record<string, true>);
            return (
              <NestedMultiselect
                placeholder={
                  !!materialOptions?.length
                    ? "Select Material Type"
                    : "No Material Type available"
                }
                onSelect={onChange}
                options={materialOptions}
                initiallySelected={initiallySelected}
              />
            );
          }}
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

export default ColorSubForm;
