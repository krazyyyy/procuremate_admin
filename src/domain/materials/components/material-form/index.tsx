import React, {useEffect, useState } from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";
import Checkbox from "../../../../components/atoms/checkbox";
import { Controller } from "react-hook-form";
import InputHeader from "../../../../components/fundamentals/input-header";
import NestedMultiselect from "../../../categories/components/multiselect";
import { useMemo } from "react";
import Medusa from "../../../../services/api"
import { FormImage } from "../../../../types/shared";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon";
import Actionables, { ActionType } from "../../../../components/molecules/actionables";
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon";
import { useFieldArray, FieldArrayWithId } from "react-hook-form";
import FileUploadField from "../../../../components/atoms/file-upload-field";

type ImageType = { selected: boolean } & FormImage;

export type MaterialFormType = {
  title: string;
  thai_name: string;
  hex_color: string;
  data_uri: string;
  material_type: string;
  images: ImageType[] | [];
  image_url: string
  price: string;
  customColor: []
  published: boolean;
};

type Props = {
  form: NestedForm<MaterialFormType>;
};


const MaterialForm = ({ form }: Props) => {
  
const [loading, setLoading] = useState(true);
const getColors = async () => {
  try {
    const data = await Medusa.customColorGroup.list(100, 1);
    const colors = data.data.custom_color_group.custom_color_group;

    const options = colors.map((color) => ({
      value: color.id,
      label: color.title || color.name,
    }));
    setLoading(false)
    return options;
  } catch (error) {
    console.error("Failed to fetch colors:", error);
    setLoading(false)
    return [];
  }
};
  const [colorOptions, setColorOptions] = useState([]);
  
  const fetchColors = async () => {
    const options = await getColors();
    setColorOptions(options);

  };

  useEffect(() => {
    fetchColors();
  }, []);



  const { register, path, setValue, control } = form;
  const actions: ActionType[] = [
    {
      label: "Delete",
      onClick: () => remove(),
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ];
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: path(`images`),
  });

  const handleFilesChosen = (files: File[]) => {
    if (files.length) {
      const toAppend = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        nativeFile: file,
        selected: false,
      }));

      append(toAppend);
    }
  };

  

  const images = useWatch({
    control,
    name: path(`images`),
    defaultValue: [],
  });

  const [materialTypes, setMaterialTypes] = useState([]);

      const fetchMaterial = async () => {
        try {
          const data = await Medusa.materialType.list(100, 0);
          const materialTypesData = data.data.material_types.material_types;
      
          const options = materialTypesData.map((materialType) => ({
            value: materialType.id,
            label: materialType.title,
          }));
      
          setMaterialTypes(options);

        } catch (error) {
          console.error("Failed to fetch material types:", error);
          setMaterialTypes([]);

        }
      };
      
      useEffect(() => {
        fetchMaterial();
      }, []);
  const selected = useMemo(() => {
    const selected: number[] = [];

    images.forEach((i, index) => {
      if (i.selected) {
        selected.push(index);
      }
    });

    return selected;
  }, [images]);
  if (loading) {
    return null
  } else {
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
        <InputField
          label="Thai Name"
          placeholder="Thai Name"
          {...register(path("thai_name"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Hex Color"
          placeholder="Hex Color"
          {...register(path("hex_color"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Data Uri"
          placeholder="data:uri"
          {...register(path("data_uri"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
  <InputHeader label="Material Type" className="mb-2" />
  <Controller
    name={path("material_type")}
    control={control}
    render={({ field }) => (
      <select {...field} className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" onChange={(e) => field.onChange(e.target.value)}>
        <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" value="">Select Material Type</option>
        {materialTypes.map((option) => (
          <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" key={option.value} value={option.value}>
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
            name={path("customColor")}
            control={control}
            render={({ field: { value, onChange } }) => {
              const initiallySelected = (value || []).reduce((acc, val) => {
                acc[val] = true
                return acc
              }, {} as Record<string, true>)
              return (
                <NestedMultiselect
                  placeholder={
                    !!colorOptions?.length
                      ? "Color Group"
                      : "No Color Group available"
                  }
                  onSelect={onChange}
                  options={colorOptions}
                  initiallySelected={initiallySelected}
                />
              )
            }}
          />
      </div>

      <div className="grid gap-x-large mb-large">
        <InputField
          label="Price"
          placeholder="Price"
          {...register(path("price"))}
        />
      </div>
      {/* <div className="grid gap-x-large mb-large">
        <Checkbox
          label="Published"
          {...register(path("published"))}
          defaultChecked={form.getValues().materials.published}
        />
      </div> */}
      <div>
        {form.getValues().materials.image_url !== "" && 
      <div
        className=" flex items-center justify-center m-2"
      >
        <img
          src={form.getValues().materials.image_url}
          alt={``}
          className="object-contain rounded-rounded max-w-full max-h-full"
        />
      </div>
}
        <div>
          <FileUploadField
            onFileChosen={handleFilesChosen}
            placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
            multiple={false} // Set to false to allow only one image
            filetypes={["image/gif", "image/jpeg", "image/png", "image/webp"]}
            className="py-large"
          />
        </div>
        {fields.length > 0 && (
          <div className="mt-large">
            <div className="mb-small flex items-center justify-between">
              <h2 className="inter-large-semibold">Uploads</h2>
            </div>
            <div className="flex flex-col gap-y-2xsmall">
              {fields.map((field, i) => {
                return (
                  <Image
                    key={field.id}
                    image={field}
                    index={i}
                    remove={remove}
                    form={form}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <hr className="mt-2" />
    </div>
  );
};
}
type ImageProps = {
  image: FieldArrayWithId<MaterialFormType["images"], "id">;
  loop_index: number;
  remove: (index: number) => void;
  form: NestedForm<MaterialFormType>;
  index: number;
};


const Image = ({ image, index, form, remove }: ImageProps) => {
  const { control, path } = form;

  const actions: ActionType[] = [
    {
      label: "Delete",
      onClick: () => remove(index),
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ];

  return (
    <Controller
      name={path(`images.${index}.selected`)}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="relative">
            <button
              className={clsx(
                "px-base py-xsmall group hover:bg-grey-5 rounded-rounded flex items-center justify-between",
                {
                  "bg-grey-5": value,
                }
              )}
              type="button"
              onClick={() => onChange(!value)}
            >
              <div className="flex items-center gap-x-large">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name || "Uploaded image"}
                    className="max-w-[64px] max-h-[64px] rounded-rounded"
                  />
                </div>
                <div className="flex flex-col inter-small-regular text-left">
                  <p>{image.name}</p>
                  <p className="text-grey-50">
                    {image.size ? `${(image.size / 1024).toFixed(2)} KB` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-base">
                <span
                  className={clsx("hidden", {
                    "!block !text-violet-60": value,
                  })}
                >
                  <CheckCircleFillIcon size={24} />
                </span>
              </div>
            </button>
            <div className="absolute top-0 right-base bottom-0 flex items-center">
              <Actionables actions={actions} forceDropdown />
            </div>
          </div>
        );
      }}
    />
  );
};


export default MaterialForm;
