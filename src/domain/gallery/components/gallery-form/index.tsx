import React, { useState, useEffect } from "react"
import InputField from "../../../../components/molecules/input"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../../components/fundamentals/input-header"
import useOrganizeData from "../../../products/components/organize-form/use-organize-data"
import { Controller } from "react-hook-form"
import { FormImage } from "../../../../types/shared";
import { useMemo } from "react";
import Medusa from "../../../../services/api"
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon";
import Actionables, { ActionType } from "../../../../components/molecules/actionables";
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon";
import { useFieldArray, FieldArrayWithId } from "react-hook-form";
import FileUploadField from "../../../../components/atoms/file-upload-field";
import FormValidator from "../../../../utils/form-validator"
import ArrowDownIcon from "../../../../components/fundamentals/icons/arrow-down-icon"
import Loading from "../../../../components/templates/Loading"
type ImageType = { selected: boolean } & FormImage;
export type GalleryFormType = {
  title: string
  description: string
  images: string[]
  category_id: string
  handle : string
  product_id: string
  custom_design_id: string
  images_list: ImageType[] | [];
}

type Props = {
  form: NestedForm<GalleryFormType>
}

const SVGRenderer = ({
  url,
  height = 400,
  width = 400,
}: {
  url: string
  height?: number
  width?: number
}) => {
  return (
    <object width={width} height={height} type="image/svg+xml" data={url} />
  )
}


const CustomDropdown = ({ options, value, onChange, loading, setLoading, productId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const getColors = async (search) => {

    try {
      const data = await Medusa.customDesign.searchIds(productId, search, search);
      const colors = data.data.custom_design;
      const options = colors.map((color) => ({
        value: color.id,
        label: `${color.product_name} - ${color.id}`,
        svg: color.svg,
        productName: `${color.product_name} | ${color.order_id.replace("order_", "")} | ${color.design_name}`
      }));
      return options;
    } catch (error) {
      console.error("Failed to fetch colors:", error);
      return [];
    }
  };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  // setFilteredOptions(options)
  const updateOptions= async (e) => {
     setSearchInput(e.target.value)
     setLoadingTwo(true)
     let dt = await getColors(e.target.value)
     setLoadingTwo(false)
     setFilteredOptions(dt)
  }
  return (
    <div className="custom-dropdown">
      <div className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 " onClick={toggleDropdown}>
        {/* Show a loading message or spinner while options are being fetched */}
        {loadingTwo ? (
          <div className="w-full cursor-pointer">Loading...</div>
        ) : (
          // Render the selected option or placeholder when options are available
           // Render the selected option or placeholder when options are available
           <div className="w-full cursor-pointer">
           {value ? (
             <>
               <div className="flex justify-center">
                 <SVGRenderer url={options.find((option) => option.value === value)?.svg} />
               </div>
               <div className="w-full">
                 <span className="dropdown-selected-text font-bold">{options.find((option) => option.value === value)?.productName}</span>
                 <div className="float-right"> 
                   <ArrowDownIcon />
                 </div>
               </div>
             </>
            ) : (
              // Render placeholder
              <>
                <span className="dropdown-placeholder">Select Design</span>
                <div className="float-right"> 
                  <ArrowDownIcon />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Search input field */}
      {isOpen && 
      <input
        type="text"
        className="w-full px-small py-xsmall border border-gray-20 rounded-rounded focus-within:shadow-input focus-within:border-violet-60"
        placeholder="Search By Order ID or Design Name"
        value={searchInput}
        onChange={(e) => updateOptions(e)}
      />
}

      {isOpen && !loading && (
        // Render the dropdown options when options are available and not loading
        <div className="dropdown-options w-full max-h-[500px] overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              className="w-full flex flex-wrap items-center bg-grey-5 hover:bg-white border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 cursor-pointer"
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              <div className="w-full">
                <SVGRenderer url={option.svg} />
              </div>
              <div>
                <span className="dropdown-option-text font-bold">{option.productName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const GalleryForm = ({ form }: Props) => {
    const { register, control, path, setValue } = form
    const [colorOptions, setColorOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const getColors = async (productId) => {
    
      try {
        const data = await Medusa.customDesign.getIds(productId);
        const colors = data.data.custom_design;
        const options = colors.map((color) => ({
          value: color.id,
          label: `${color.product_name} - ${color.id}`,
          svg: color.svg,
          productName: `${color.product_name} | ${color.order_id.replace("order_", "")} | ${color.design_name}`
        }));
        return options;
      } catch (error) {
        console.error("Failed to fetch colors:", error);
        return [];
      }
    };
    
    
    const getProduct = async () => {
      try {
        const data = await Medusa.products.list();
        const colors = data.data.products;
        console.log(colors)
        const options = colors.map((color, idx) => ({
          value: color.id,
          label: color.title,
        }));
    
        return options;
      } catch (error) {
        console.error("Failed to fetch colors:", error);
        return [];
      }
    };
    
    


    const [loading, setLoading] = useState(true);
    const fetchColors = async () => {
      const poptions = await getProduct();
      setProductOptions(poptions);
      setLoading(false);
    };
  
    useEffect(() => {
      fetchColors();
    }, []);
  const categoriesOptions = useOrganizeData("").categoriesOptions
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
    name: path(`images_list`),
  });
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(productOptions);
  
  // Add a useEffect to update the filtered options when the search input changes
  useEffect(() => {
    console.log(searchInput)
    if (searchInput.trim() === '') {
      setFilteredOptions(productOptions);
    } else {
      setFilteredOptions(
        productOptions.filter((option) =>
          option.label.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [searchInput, productOptions]);
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
  // Add state for tracking if user is searching
const [isSearching, setIsSearching] = useState(false);

// Toggle the search mode when the input field is clicked
const handleSearchClick = () => {
  setIsSearching(true);
};
  useEffect(() => {
    const initialValueP = form.getValues("gallery.product_id");
    // setSelectedValue(initialValue);
  
      const fetchColorsByProductId = async () => {
        setLoading(true);
        const options = await getColors(initialValueP);
        
        setColorOptions(options);
        setLoading(false);
      };
      fetchColorsByProductId();
      const initialValue = form.getValues("gallery.custom_design_id");
      setSelectedValue(initialValue);
  }, [form]);

  const images = useWatch({
    control,
    name: path(`images_list`),
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

    // State to hold the selected value
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
      const initialValue = form.getValues("gallery.custom_design_id");
      setSelectedValue(initialValue);
    }, []);


    const handleSelectionChange = (value) => {
      form.setValue("gallery.custom_design_id", value);
      setSelectedValue(value);
    };

  return (
    <div className="mb-40">
  
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Title"
          placeholder="Title"
          required
          {...register(path("title"))}
        />
      </div>

      <div className="grid gap-x-large mb-large">
        <InputField
          label="Handle"
          placeholder="Handle"
          required
          {...register(path("handle"), {
            required: "Handle is required",
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
        />
      </div>
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Description"
          placeholder="Description"
          {...register(path("description"))}
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
      <div className="grid gap-x-large mb-large">
  <InputHeader label="Product" className="mb-2" />

  <Controller
  name={path("product_id")}
  control={control}
  render={({ field }) => (
    <div className="relative">
      <div className="dropdown inline-block relative grid gap-x-large mb-large">
        <button
          type="button"
          onClick={() => setIsSearching(!isSearching)}
          className={`w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10 ${
            isSearching ? '-none' : ''
          }`}
        >
         <span className={"dropdown-trigger-button w-full flex items-center px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 " + (isSearching ? 'block' : 'block')}>

            {field.value ? filteredOptions.find(opt => opt.value === field.value)?.label : 'Select Product'}
          </span>
          {/* {isSearching && (
            <input
              type="hidden"
              placeholder="Search Product"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-violet-60"
            />
          )} */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 ${
              isSearching ? 'transform rotate-180' : 'transform rotate-0'
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414zM4 6a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isSearching && (
          <div className="dropdown-content bg-white border border-gray-20 mt-[42px] p-2 rounded-md absolute w-full">
            <input
              type="text"
              placeholder="Search.."
              id="myInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-violet-60"
            />
            {filteredOptions.map((option) => (
              <a
                key={option.value}
                href="javascript:void(0)"
                className="block px-2 py-1 text-gray-800 hover:bg-gray-200 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSearching(false);
                  field.onChange(option.value);
                  const selectedProductId = option.value;
                  if (selectedProductId) {
                    const fetchColorsByProductId = async () => {
                      setLoading(true);
                      const options = await getColors(selectedProductId);
                      setColorOptions(options);
                      setLoading(false);
                    };
                    fetchColorsByProductId();
                  }
                }}
              >
                {option.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )}
/>
</div>

{
  !loading ? (
    <div className="grid gap-x-large mb-large">
      <InputHeader label="Link Design (Select Product First)" className="mb-2" />
      <CustomDropdown options={colorOptions} value={selectedValue} onChange={handleSelectionChange} loading={loading} setLoading={setLoading} productId={form.getValues("gallery.product_id")}/>
    </div>
  ) : (
    <Loading />
  )
}


      {/* <div className="grid gap-x-large mb-large">
        <InputHeader label="Link Design" className="mb-2" />
        <Controller
          name={path("custom_design_id")}
          control={control}
          render={({ field }) => (
            <select {...field} className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" onChange={(e) => field.onChange(e.target.value)}>
              <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" value="">Select Design</option>
              {colorOptions.map((option) => (
                <option className="w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div> */}
      {form.getValues().gallery.images && form.getValues().gallery.images.length !== 0 && (
  <div className="flex flex-wrap items-center justify-center m-2">
    {form.getValues().gallery.images.map((image, index) => (
      <img
        key={index}
        src={image}
        alt=""
        className="object-contain rounded-rounded max-w-full max-h-full"
      />
    ))}
  </div>
)}

           
      <div>
          <FileUploadField
            onFileChosen={handleFilesChosen}
            placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
            multiple // Set to false to allow only one image
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
    
  )
}


type ImageProps = {
  image: FieldArrayWithId<GalleryFormType["images"], "id">;
  loop_index: number;
  remove: (index: number) => void;
  form: NestedForm<GalleryFormType>;
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
      name={path(`images_list.${index}.selected`)}
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

export default GalleryForm
