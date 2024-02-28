import React from "react";
import InputField from "../../../../components/molecules/input";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon";
import Actionables, { ActionType } from "../../../../components/molecules/actionables";
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon";
import { useFieldArray, FieldArrayWithId } from "react-hook-form";
import FileUploadField from "../../../../components/atoms/file-upload-field";
import { useWatch } from "react-hook-form";
import { FormImage } from "../../../../types/shared";
import { useMemo } from "react";
import Button from "../../../../components/fundamentals/button";
import Medusa from "../../../../services/api"
import useNotification from "../../../../hooks/use-notification"
type ImageType = { selected: boolean } & FormImage;

export type EditFormType = {
  style_id: string;
  title: string;
  price: string | null;
  subtitle: string | null;
  custom_style_id: string;
  images: ImageType[] | [];
  image_url: string
};

type Props = {
  form: NestedForm<EditFormType[]>;
  index: number;
  key: number;
  setObjectList: {}
};

const EditForm = ({ form, index, key, setObjectList }: Props) => {
  const { register, path, setValue, control } = form;
  const removeObjectById = (idToRemove: string) => {
    setObjectList((prevList) =>
      prevList.filter((obj) => obj.id !== idToRemove)
    );
  };
  const actions: ActionType[] = [
    {
      label: "Delete",
      onClick: () => remove(index),
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ];
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: path(`${index}.images`),
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
    name: path(`${index}.images`),
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

  const handleRemove = () => {
    remove(selected);
  };

  const handleDeselect = () => {
    selected.forEach((i) => {
      setValue(path(`${index}.images.${i}.selected`), false);
    });
  };

  const notification = useNotification()

  let setting_id
  try {
    setting_id = form?.getValues()?.style_option[index]?.style_id || ""
  } catch {
    setting_id = ""
  }

  const deleteSettings = async () => {
    if (setting_id !== "") {
      await Medusa.customStyleOption.delete(setting_id)
      removeObjectById(setting_id)
      notification("Success", "Removed Settings", "success")
    } 
  }

  return (
    <div className="mb-4" key={key}>
      <div className="grid  gap-x-large mb-large">
        <InputField
          label="Title"
          placeholder="New Style"
          {...register(path(`${index}.title`))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Subtitle"
          placeholder="Sub Title"
          {...register(path(`${index}.subtitle`))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Price"
          placeholder="Price"
          {...register(path(`${index}.price`))}
        />
      </div>
      <div>
      {form.getValues()?.style_option[index]?.image_url && form.getValues().style_option[index].image_url !== "" && 
      <div
        className=" flex items-center justify-center m-2"
      >
        <img
          src={form.getValues().style_option[index].image_url}
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
                    index={index}
                    loop_index={i}
                    remove={remove}
                    form={form}
                  />
                );
              })}
            </div>
          </div>
        )}
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
      <hr className="mt-2" />
    </div>
  );
};

type ImageProps = {
  image: FieldArrayWithId<EditFormType["images"], "id">;
  loop_index: number;
  remove: (index: number) => void;
  form: NestedForm<EditFormType[]>;
  index: number;
};

const Image = ({ image, loop_index, form, remove, index }: ImageProps) => {
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
      name={path(`${index}.images.${loop_index}.selected`)}
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

export default EditForm;
