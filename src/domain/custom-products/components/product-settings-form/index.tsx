import InputField from "../../../../components/molecules/input";
import Accordion from "../../../../components/organisms/accordion";
import InputHeader from "../../../../components/fundamentals/input-header";
import { useForm, Controller } from "react-hook-form";
import Medusa from "../../../../services/api";
import React, { useEffect, useState } from "react";
import Checkbox from "../../../../components/atoms/checkbox";
import Button from "../../../../components/fundamentals/button";
import useNotification from "../../../../hooks/use-notification";
const ProductSettingsForm = ({ objectList, setObjectList, handleInputChange }) => {
  const [areaSizes, setAreaSizes] = useState([]);
  const [colorGroup, setColorGroup] = useState([]);
  const { control } = useForm();
  const notification = useNotification()

  const removeObjectById = (idToRemove: string) => {
    setObjectList((prevList) =>
      prevList.filter((obj) => obj.id !== idToRemove)
    );
  };

  const fetchMaterial = async () => {
    try {
      const data = await Medusa.customizerAreas.list();
      console.log(data.data.areas);
      const areaSizesData = data.data.areas;
      console.log(areaSizesData);
      const options = areaSizesData.map((areaSize) => ({
        value: areaSize.id,
        label: areaSize.title,
      }));

      setAreaSizes(options);
    } catch (error) {
      console.error("Failed to fetch material types:", error);
      setAreaSizes([]);
    }
  };

  const deleteProductSettings = async (product_id, name_id) => {
    if (name_id !== product_id) {
      await Medusa.customProductSetting.delete(product_id)
      removeObjectById(product_id)
    } else {
      removeObjectById(product_id)
    }
    notification("Success", "Removed Settings", "success")
  }

  const fetchColorsGroup = async () => {
    try {
      const data = await Medusa.customizerColorGroup.list();
      const color_groups = data.data.color_groups;
      const options = color_groups.map((color) => ({
        value: color.id,
        label: color.title,
      }));

      setColorGroup(options);
    } catch (error) {
      console.error("Failed to fetch Color Group:", error);
      setColorGroup([]);
    }
  };

  useEffect(() => {
    fetchMaterial();
    fetchColorsGroup();
  }, []);

  return (
    <Accordion className="pt-5" type="multiple">
      <div>
        {objectList.map((obj, idx) => (
          <div key={obj.id}>
    <Accordion.Item title={obj.name ? `${obj.name} - ${obj.name_id}` : `newSetting(${obj.name_id})`} value={obj.name_id}>


              <div>
                <InputField
                  label="Name"
                  placeholder="Name"
                  value={obj.name}
                  onChange={(e) => handleInputChange(idx, "name", e.target.value)}
                />
              </div>
              <div>
                <InputField
                  label="Position"
                  placeholder="Position"
                  type="number"
                  value={obj.rank}
                  onChange={(e) => handleInputChange(idx, "rank", e.target.value)}
                />
              </div>
              <div>
                <InputField
                  label="Thai Name"
                  placeholder="ThaiName"
                  value={obj.thai_name}
                  onChange={(e) => handleInputChange(idx, "thai_name", e.target.value)}
                />
              </div>
              <div className="grid gap-x-large mb-large">
                <InputHeader label="Area Size" className="mb-2" />
                <Controller
                  control={control}
                  name={`area_size_${idx}`}
                  defaultValue={obj.area_size || ""}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                      onChange={(e) => handleInputChange(idx, "customizer_area_id", e.target.value)}
                      value={obj.customizer_area_id || ""}
                    >
                      <option value="">Select Area Size</option>
                      {areaSizes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="grid gap-x-large mb-large">
                <InputHeader label="Color Group" className="mb-2" />
                <Controller
                  control={control}
                  name={`color_group_${idx}`}
                  defaultValue={obj.material_group || ""}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                      onChange={(e) => handleInputChange(idx, "material_group", e.target.value)}
                      value={obj.material_group || ""}
                    >
                      <option value="">Select Color Group</option>
                      {colorGroup.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="grid gap-x-large mb-large">
                <Checkbox
                  label="Muay Thai"
                  defaultChecked={obj.muay_thai}
                  onChange={(e) => handleInputChange(idx, "muay_thai", e.target.checked)}
                />
              </div>
              <div>
                <InputField
                  label="Pre Set Material"
                  placeholder="Pre Set Material"
                  value={obj.preset_material}
                  onChange={(e) => handleInputChange(idx, "preset_material", e.target.value)}
                />
              </div>
              <div>
              <Button
                size="small"
                variant="danger"
                type="button"
                className="float-right mt-2"
                onClick={() => deleteProductSettings(obj.id, obj.name_id)}
              >
                {obj.id === obj.name_id ? "Remove" : "Delete"}
              </Button>

              </div>
            </Accordion.Item>
          </div>
        ))}
      </div>
    </Accordion>
  );
};

export default ProductSettingsForm;
