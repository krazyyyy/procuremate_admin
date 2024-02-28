import { useAdminProduct } from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import { getErrorStatus } from "../../../utils/get-error-status"
import GeneralSection from "./sections/general"
import MediaSection from "./sections/media"
import RawSection from "./sections/raw"
import SvgSection from "./sections/svg"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react";
import SeoSection from "../../products/edit/sections/seo"
import ProductSettingsForm from "../components/product-settings-form"
import Accordion from "../../../components/organisms/accordion"
import Button from "../../../components/fundamentals/button"
import async from "react-select/dist/declarations/src/async/index"
import useNotification from "../../../hooks/use-notification"
import ThumbnailSection from "../../products/edit/sections/thumbnail"
const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ids, setIds] = useState<string[]>([]);
  const [objectList, setObjectList] = useState<{ id: string; inputFieldKey: string; thai_name: string, material_group: string, area_size: string, preset_material: string, product_id: string, muay_thai: boolean, name_id : string, rank : number }[]>([]);
  const handleInputChange = (idx: number, field: string, value: string) => {
    setObjectList(prevList => {
      const updatedList = prevList.map((obj, i) => {
        if (i === idx) {
        // Update the specific field with the new value
        return {
          ...obj,
          [field]: value
        };
      }
      return obj;
    });
    return updatedList;
  });
};
const notification = useNotification()

// Function to handle the updated objects in objectList
const handleUpdatedObjects = async () => {
  const updatedObjects = objectList.filter((obj, idx) => {
    const originalObject = ids[idx];
    // Check if any field in the object has been updated
    
    return Object.keys(obj).some(key => obj[key] !== originalObject[key]);
  });
  updatedObjects.map(async (i) => {
    try {
      const {id, product_id, ...rest} = i
      if (id.includes("custom_product_settings")) {
        const resp = await Medusa.customProductSetting.update(id, rest)
      } else {
        const {id, ...data} = i
        const resp = await Medusa.customProductSetting.create(data)
        
      }
    } catch (err) {
      // notification("Error",  "Unknown Error", "error")
    }
  })
  notification("Success",  "Successfully Updated", "success")
  // Call your desired function with the updated objects
};

// Call handleUpdatedObjects on button click
const handleButtonClick = () => {
  handleUpdatedObjects();
};

const extractSVGIds = (svg) => {
  // Create a temporary element to parse the SVG
  const tempElement = document.createElement('div');
  tempElement.innerHTML = svg;

  // Find all elements with ID attribute
  const idElements = tempElement.querySelectorAll('[id]');


  const ids = Array.from(idElements)
  .filter((element) => element.tagName !== 'svg' && !element.id.toLowerCase().includes('hidden'))
  .map((element) => element.id);


    const filteredIds = ids.filter(id => {
      const matchingObject = objectList.find(obj => obj.name_id === id);
      if (matchingObject) {
        // ID exists in the Objectlist, remove it
        return false;
      }
      return true;
    });


  return filteredIds;
};

const handleSvgUrl = (svgUrl) => {
  fetch(svgUrl)
    .then((response) => response.text())
    .then((svgContent) => {
      const extractedIds = extractSVGIds(svgContent);

      // Filter out the IDs that are already present in the `ids` state
      const newIds = extractedIds.filter((id) => !ids.includes(id));

      // If there are new IDs, update the `ids` state
      if (newIds.length > 0) {
        setIds((prevIds) => [...prevIds, ...newIds]);
      }
    })
    .catch((error) => {
      console.error('Error fetching SVG:', error);
    });
};


const handleReload = () => {
  handleSvgUrl(product?.metadata?.template_image)
}

useEffect(() => {
  const getProductSettings = async () => {
    const data = await Medusa.customProductSetting.list(`?product_id=${id}`);
    setIds(data.data.custom_product_settings.custom_product_settings);
  };

  getProductSettings();

  // Clean up function to prevent memory leaks
  return () => {
    // Any cleanup logic you may have
  };
}, []);

const { product, status, error } = useAdminProduct(id || "")
useEffect(() => {
  // Update objectList whenever it changes
  const Objs = ids.map((i) => {

    return {
      id: i?.id || i,
      name_id: i?.name_id || i,
      name: i?.name  || "",
      thai_name: i?.thai_name || "",
      material_group: i?.material_group?.id || "",
      customizer_area_id: i?.customizer_area_id?.id || "",
      muay_thai: i?.muay_thai || false,
      preset_material: i?.preset_material || "",
      rank: i?.rank || "",
      product_id: id,
    };
  });
  setObjectList(Objs);
}, [ids]);

  

  if (error) {
    let message = "An unknown error occurred"

    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      message = errorStatus.message

      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }
  if (status === "loading" || !product) {
    // temp, perhaps use skeletons?
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/custom-products"
        label="Back to Custom Products"
        className="mb-xsmall"
      />
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-8 flex flex-col gap-y-xsmall">
          <GeneralSection product={product} />
   
          <div className="bg-white p-5">
          <h1 className="text-grey-90 inter-xlarge-semibold">Product Settings</h1>
          <ProductSettingsForm objectList={objectList} setObjectList={setObjectList} handleInputChange={handleInputChange}/>
 {objectList.length !== 0 &&
          <Button
                size="small"
                variant="primary"
                type="button"
                className="float-right mt-2"
                // disabled={!isDirty}
                onClick={handleButtonClick}
              >
                Update Settings
          </Button>
}
          </div>
          <SeoSection product={product} />
          <RawSection product={product} />
        </div>
        <div className="flex flex-col col-span-4 gap-y-xsmall">
          <SvgSection product={product} setObjectList={setObjectList} setIds={setIds} objectList={objectList}/>

          <ThumbnailSection product={product} />
          <MediaSection product={product} />
          <Button
                size="small"
                variant="nuclear"
                type="button"
                className="float-right mt-2"
                // disabled={!isDirty}
                onClick={handleReload}
              >
                Reload
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Edit
