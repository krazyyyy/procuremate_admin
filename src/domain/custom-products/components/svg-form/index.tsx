import clsx from "clsx";
import React, { useMemo } from "react";
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import FileUploadField from "../../../../components/atoms/file-upload-field";
import Button from "../../../../components/fundamentals/button";
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon";
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon";
import Actionables, {
  ActionType,
} from "../../../../components/molecules/actionables";
import { FormImage } from "../../../../types/shared";
import { NestedForm } from "../../../../utils/nested-form";

type ImageType = { selected: boolean } & FormImage;

export type SVGFormType = {
  images: ImageType[];
};

type Props = {
  form: NestedForm<SVGFormType>;
  setIds: React.Dispatch<React.SetStateAction<string[]>>; // New prop for setting extracted IDs
  is_svg: boolean | false
};

const SVGForm = ({ form, setIds, is_svg=false }: Props) => {
  const { control, path, setValue } = form;

  // let fields, append, remove;

  // if (!is_svg) {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: path("images"),
  });
  // } else {
  //   ({ fields, append, remove } = useFieldArray({
  //     control: control,
  //     name: path("metadata.template_image"),
  //   }));
  // }

  const extractSVGIds = (svg) => {
    // Create a temporary element to parse the SVG
    const tempElement = document.createElement('div');
    tempElement.innerHTML = svg;

    // Find all elements with ID attribute
    const idElements = tempElement.querySelectorAll('[id]');
    
    // Extract the IDs from the elements
 
    const ids = Array.from(idElements)
    .filter((element) => element.tagName !== 'svg' && !element.id.toLowerCase().includes('hidden'))
    .map((element) => element.id);
  
  

    // Return the array of IDs
    return ids;
  };

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
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedSVG = e.target.result;
        const extractedIds = extractSVGIds(uploadedSVG);
        console.log(extractedIds)
        setIds(extractedIds);
      };
      reader.readAsText(file);
    }
  };
  let images
  if (!is_svg) {
    images = useWatch({
      control,
      name: path("images"),
      defaultValue: [],
    });
  } else {
    images = useWatch({
      control,
      name: path("metadata.template_image"),
      defaultValue: [],
    });
  }

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
      setValue(path(`images.${i}.selected`), false);
    });
  };

  return (
<div>
  <div>
    <div>
      <FileUploadField
        onFileChosen={handleFilesChosen}
        placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
        multiple={!is_svg} // Set `multiple` to `true` when `is_svg` is false, and `false` when `is_svg` is true
        filetypes={["image/gif", "image/jpeg", "image/png", "image/webp", "image/svg+xml"]}
        className="py-large"
      />
    </div>
  </div>
  {fields.length > 0 && (
    <div className="mt-large">
      <div className="mb-small flex items-center justify-between">
        <h2 className="inter-large-semibold">Uploads</h2>
        <ModalActions
          number={selected.length}
          onDeselect={handleDeselect}
          onRemove={handleRemove}
        />
      </div>
      <div className="flex flex-col gap-y-2xsmall">
        {fields.length > 0 &&
// const lastItem = ;

        <Image
          key={fields[fields.length - 1].id}
          image={fields[fields.length - 1]}
          index={fields.length - 1}
          remove={remove}
          form={form}
        />

        }
      </div>
    </div>
  )}
</div>

  );
};

type ImageProps = {
  image: FieldArrayWithId<SVGFormType, "images", "id">;
  index: number;
  remove: (index: number) => void;
  form: NestedForm<SVGFormType>;
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

type ModalActionsProps = {
  number: number;
  onRemove: () => void;
  onDeselect: () => void;
};

const ModalActions = ({ number, onRemove, onDeselect }: ModalActionsProps) => {
  return (
    <div className="h-10 overflow-y-hidden flex items-center pr-1">
      <div
        className={clsx(
          "flex items-center gap-x-small transition-all duration-200",
          {
            "translate-y-[-42px]": !number,
            "translate-y-[0px]": number,
          }
        )}
      >
        <span>{number} selected</span>
        <div className="w-px h-5 bg-grey-20" />
        <div className="flex items-center gap-x-xsmall">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={onDeselect}
          >
            Deselect
          </Button>
          <Button
            variant="danger"
            size="small"
            type="button"
            onClick={onRemove}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SVGForm;
