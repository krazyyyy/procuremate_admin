import React from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";
import Checkbox from "../../../../components/atoms/checkbox";
import { FormImage } from "../../../../types/shared";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon";
import Actionables, { ActionType } from "../../../../components/molecules/actionables";
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon";
import { useFieldArray, FieldArrayWithId } from "react-hook-form";
import FileUploadField from "../../../../components/atoms/file-upload-field";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
type ImageType = { selected: boolean } & FormImage;

export type ColorGroupFormType = {
  title: string;
  hex_color: string;
  images: ImageType[] | [];
  image_url: string
  published: boolean;
};

type Props = {
  form: NestedForm<ColorGroupFormType>;
};

const ColorGroupForm = ({ form }: Props) => {

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
  const selected = useMemo(() => {
    const selected: number[] = [];

    images.forEach((i, index) => {
      if (i.selected) {
        selected.push(index);
      }
    });

    return selected;
  }, [images]);



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
          label="Hex Color"
          placeholder="Hex Color"
          {...register(path("hex_color"))}
        />
      </div>
      {/* <div className="grid gap-x-large mb-large">
        <Checkbox
          label="Published"
          {...register(path("published"))}
          defaultChecked={form.getValues().color_group.published}
        />
      </div> */}
      <div>
        {form.getValues().color_group.image_url !== "" && 
      <div
        className=" flex items-center justify-center m-2"
      >
        <img
          src={form.getValues().color_group.image_url}
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


type ImageProps = {
  image: FieldArrayWithId<ColorGroupFormType["images"], "id">;
  loop_index: number;
  remove: (index: number) => void;
  form: NestedForm<ColorGroupFormType>;
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


export default ColorGroupForm;
