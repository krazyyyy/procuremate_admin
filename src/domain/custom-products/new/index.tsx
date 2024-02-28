import { AdminPostProductsReq } from "@medusajs/medusa"
import { useAdminCreateProduct } from "medusa-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import { useFeatureFlag } from "../../../context/feature-flag"
import useNotification from "../../../hooks/use-notification"
import { FormImage, ProductStatus } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import { prepareImages } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import SeoForm, { SeoFormType } from "../../products/components/seo-form"

import GeneralForm, { GeneralFormType } from "../components/general-form"
import MediaForm, { MediaFormType } from "../components/media-form"
import ThumbnailForm, { ThumbnailFormType } from "../components/thumbnail-form"
import AddVariantsForm, { AddVariantsFormType } from "./add-variants"
import Medusa from "../../../services/api"
// import OrganizeForm, { OrganizeFormType } from "../components/organize-form"
import OrganizeForm, { OrganizeFormType } from "../../products/components/organize-form"
import InputField from "../../../components/molecules/input"
import SVGForm, { SVGFormType } from "../components/svg-form"
import ProductSettingsForm from "../components/product-settings-form"
import PricesForm from "../components/prices-form"
import { useFieldArray } from "react-hook-form";
import { useAdminStore } from "medusa-react"
import async from "react-select/dist/declarations/src/async/index"

type PricePayload = {
  id: string | null;
  amount: number | null;
  currency_code: string;
  region_id: string | null;
  includes_tax?: boolean;
};

type PricesFormType = {
  prices: PricePayload[];
};


export interface ExtendedAdminPostProductsReq extends AdminPostProductsReq {
  seo_title?: string;
  seo_description?: string;
  page_title?: string;
  canonical_url?: string;
  comment?: string;
}

type NewProductForm = {
  general: GeneralFormType
  variants: AddVariantsFormType
  media: MediaFormType
  thumbnail: ThumbnailFormType
  organize: OrganizeFormType
  seoForm : SeoFormType
  svgForm: SVGFormType
  prices: PricesFormType; // Add this line
}

type Props = {
  onClose: () => void
}



  async function getCustomProducts(data, product_id) {
    try {
      const response = await Medusa.customProducts.create({
        "code" : data.code,
        "product_id" : product_id,
        "template_image" : "",
      });
    } catch (error) {
      console.log(error)
      // Handle the network error
    }
  }


const NewProduct = ({ onClose }: Props) => {

    
  const extractSVGIds = (svg) => {
    // Create a temporary element to parse the SVG
    const tempElement = document.createElement('div');
    tempElement.innerHTML = svg;

    // Find all elements with ID attribute
    const idElements = tempElement.querySelectorAll('[id]');

    // Extract the IDs from the elements
    const ids = Array.from(idElements).map((element) => element.id);

    // Return the array of IDs
    return ids;
  };
  const { store } = useAdminStore();

  const [ids, setIds] = useState<string[]>([]);

  const form = useForm<NewProductForm>({
    defaultValues: createBlank(),
  })
  const { mutate } = useAdminCreateProduct()
  const navigate = useNavigate()
  const notification = useNotification()

  const [sku, setSku] = useState('')
  const handleSkuChange = (event) => {
    setSku(event.target.value); // Replace `setSku` with the setter function for the SKU value
  };
  const [inventory, setInventory] = useState(0)
  const handleInvChange = (event) => {
    setInventory(event.target.value); // Replace `setSku` with the setter function for the SKU value
  };


  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form

  const closeAndReset = () => {
    reset(createBlank())
    onClose()
  }

  useEffect(() => {
    reset(createBlank())
  }, [])

  const { isFeatureEnabled } = useFeatureFlag()

  const [objectList, setObjectList] = useState<{ id: string; inputFieldKey: string; thai_name: string, material_group: string, area_size: string, preset_material: string, product_id: string, muay_thai: boolean, name_id : string   }[]>([]);
  // Update the object in the objectList based on the index (idx)
  const handleInputChange = (idx: number, field: string, value: string) => {
    setObjectList(prevList => {
      const updatedList = [...prevList];
      updatedList[idx] = {
        ...updatedList[idx],
        [field]: value
      };
      return updatedList;
    });
  };


  // Update the object list when the ids change
  useEffect(() => {
    const Objs = ids.map((id) => {
      return {
        "id": id,
        "name_id" : id,
        "name": '',
        "thai_name": '',
        "material_group": '',
        "customizer_area_id": '',
        "muay_thai" : false,
        "preset_material": '',
        "product_id" : "",
        "rank" : ""
      }
    })
    setObjectList(Objs);
  }, [ids]);


  const { control } = form;
  const { append, fields } = useFieldArray({
    control,
    name: "prices.prices", // Update this with the correct path to the prices field
  });
  const createProductSettings = async (settings) => {
    await Medusa.customProductSetting.create(settings)
  }
  // const [templateImage, set_template_image] = useState("")
  const onSubmit = (publish = true) =>
    handleSubmit(async (data) => {
      const payload = createPayload(
        data,
        publish,
        sku,
        inventory,
        isFeatureEnabled("sales_channels")
      )

      let templateImage = ''
      if (data?.svgForm?.images?.length) {
        let preppedImages: FormImage[] = []
   
        const files = data.svgForm.images.map((i) => i.nativeFile)
        console.log(data.svgForm.images)
        console.log(files)
        const response = await Medusa.uploadSvg.create(files)
   
        const urls = response.data['url']
        templateImage = urls

      }
      if (data.media?.images?.length) {
        let preppedImages: FormImage[] = []

        try {
          preppedImages = await prepareImages(data.media.images)
        } catch (error) {
          let errorMessage =
            "Something went wrong while trying to upload images."
          const response = (error as any).response as Response

          if (response.status === 500) {
            errorMessage =
              errorMessage +
              " " +
              "You might not have a file service configured. Please contact your administrator"
          }

          notification("Error", errorMessage, "error")
          return
        }
        const urls = preppedImages.map((image) => image.url)

        payload.images = urls
      }

      if (data.thumbnail?.images?.length) {
        let preppedImages: FormImage[] = []

        try {
          preppedImages = await prepareImages(data.thumbnail.images)
        } catch (error) {
          let errorMessage =
            "Something went wrong while trying to upload the thumbnail."
          const response = (error as any).response as Response

          if (response.status === 500) {
            errorMessage =
              errorMessage +
              " " +
              "You might not have a file service configured. Please contact your administrator"
          }

          notification("Error", errorMessage, "error")
          return
        }
        const urls = preppedImages.map((image) => image.url)

        payload.thumbnail = urls[0]
      }

      mutate(payload, {
        onSuccess: async ({ product }) => {
          closeAndReset()
          objectList.map((i) => {
            const { id, ...rest } = i;
            const item = rest
            item.product_id = product.id
            createProductSettings(item)
          })
          product.variants.map(async (vari) => {
            await Medusa.updateVariantPrice.update(vari.id)
          })
          await Medusa.products.update(product.id, { metadata : {
            template_image : templateImage 
          }})
          getCustomProducts(data.general, product.id)
      
          navigate(`/a/custom-products/${product.id}`)
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    })

  return (
    <form className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="flex justify-between w-full px-8 medium:w-8/12">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={closeAndReset}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="flex gap-x-small">
              <Button
                size="small"
                variant="secondary"
                type="button"
                disabled={!isDirty}
                onClick={onSubmit(false)}
              >
                Save as draft
              </Button>
              <Button
                size="small"
                variant="primary"
                type="button"
                disabled={!isDirty}
                onClick={onSubmit(true)}
              >
                Publish product
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="flex justify-center w-full no-scrollbar">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] my-16">
            <Accordion defaultValue={["general"]} type="multiple">
              <Accordion.Item
                value={"general"}
                title="General information"
                required
              >
                <p className="inter-base-regular text-grey-50">
                  To start selling, all you need is a name and a price. Upload
                </p>
                <div className="flex flex-col mt-xlarge gap-y-xlarge">
                  <GeneralForm
                    form={nestedForm(form, "general")}
                    requireHandle={false}
                  />
                  <InputField
                    label="Code"
                    type="text"
                    value={sku}
                    onChange={handleSkuChange}
                    // {...form.register(`variants.0.sku`)}
                  />
                  <InputField
                    label="Inventory"
                    type="number"
                    value={inventory}
                    onChange={handleInvChange}
                    // {...form.register(`variants.0.sku`)}
                  />
              {store?.currencies.map((currency) => {
                if (currency.code === "usd") {
                  return (
                    <InputField
                      key={currency.code}
                      label={currency.code.toUpperCase()}
                      type="number"
                      min={0}
                      step={0.01}
                      {...form.register(`prices.prices.${currency.code}.amount`)}
                    />
                  );
                }
                return null; // Render nothing for non-USD currencies
              })}

                
                </div>
              </Accordion.Item>
              <Accordion.Item title="Custom Template" value="Custom Template">
                <SVGForm form={nestedForm(form, "svgForm")} setIds={setIds} />
              </Accordion.Item>
              <Accordion.Item title="Product Settings" value="product_settings">
              <ProductSettingsForm objectList={objectList} setObjectList={setObjectList} handleInputChange={handleInputChange} />

              </Accordion.Item>
              <Accordion.Item title="Organize" value="organize">
                <p className="inter-base-regular text-grey-50">
                  To start selling, all you need is a name and a price.
                </p>
                <div className="flex flex-col mt-xlarge gap-y-xlarge pb-xsmall">
                  <div>
                    <h3 className="inter-base-semibold mb-base">
                      Organize Product
                    </h3>
                    <OrganizeForm form={nestedForm(form, "organize")} type="Custom" />
   
                  </div>
                </div>
              </Accordion.Item>
              <Accordion.Item title="SEO" value="SEO">
                <p className="inter-base-regular text-grey-50">
                  Insert SEO Page Information.
                </p>
                <div className="flex flex-col mt-xlarge gap-y-xlarge pb-xsmall">
                  <div>
                    <h3 className="inter-base-semibold mb-base">
                      Manage SEO
                    </h3>
                    <SeoForm form={nestedForm(form, "seoForm")} />

                  </div>
                </div>
              </Accordion.Item>
   
              <Accordion.Item title="Media" value="media">
                <p className="inter-base-regular text-grey-50 mb-large">
                  Add images to your product.
                </p>
                <MediaForm form={nestedForm(form, "media")} />
              </Accordion.Item>
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (
  data: NewProductForm,
  publish = true,
  sku: string,
  inventory: string,
  salesChannelsEnabled = false
): AdminPostProductsReq => {
  const payload: AdminPostProductsReq = {
    title: data.general.title,
    subtitle: data.general.subtitle || undefined,
    material: data.general.material || undefined,
    handle: data.general.handle,
    is_giftcard: false,
    collection_id: data.organize.collection?.value,
    description: data.general.description || undefined,
    categories: data.organize.categories?.length
      ? data.organize.categories.map((id) => ({ id }))
      : undefined,
    type: data.organize.type
      ? {
          value: data.organize.type.label,
          id: data.organize.type.value,
        }
      : undefined,
    tags: [
      ...(data.organize.tags || []).map((t) => ({ value: t })), // Include existing tags if present
    ],
    options: [
      ...data.variants.options.map((o) => ({
        title: o.title,
      })),
      {
        title: "Color", // Existing option title
      },
    ],
    variants: data.variants.entries.length > 0
      ? data.variants.entries.map((v) => ({
          title: v.general.title!,
          material: v.general.material || undefined,
          inventory_quantity: v.stock.inventory_quantity || 0,
          prices: getVariantPrices(v.prices),
          allow_backorder: v.stock.allow_backorder,
          sku: v.stock.sku || undefined,
          barcode: v.stock.barcode || undefined,
          options: v.options.map((o) => ({
            value: o.option?.value!,
          })),
          ean: v.stock.ean || undefined,
          upc: v.stock.upc || undefined,
          height: v.dimensions.height || undefined,
          length: v.dimensions.length || undefined,
          weight: v.dimensions.weight || undefined,
          width: v.dimensions.width || undefined,
          hs_code: v.customs.hs_code || undefined,
          mid_code: v.customs.mid_code || undefined,
          origin_country: v.customs.origin_country?.value || undefined,
          manage_inventory: v.stock.manage_inventory,
          metadata: {
            seo_title: data.seoForm.seo_title,
            page_title: data.seoForm.page_title,
            seo_description: data.seoForm.seo_description,
            canonical_url: data.seoForm.canonical_url,
          },
        }))
      : [
          {
            title: "Black", // Set the default variant title
            sku: sku,
            inventory_quantity: parseInt(inventory),
            options: [
              {
                value: "Black", // Set the existing option value
              },
            ],
            prices: extractPrices(data.prices.prices)
          },
        ],
    status: publish ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
  };

  return payload;
};


const createBlank = (): NewProductForm => {
  return {
    general: {
      title: "",
      material: null,
      subtitle: null,
      description: null,
      handle: "",
    },
    media: {
      images: [],
    },
    organize: {
      collection: null,
      categories: null,
      tags: null,
      type: null,
    },
    thumbnail: {
      images: [],
    },
    variants: {
      entries: [],
      options: [],
    },
    seoForm: {
      seo_title: "",
      seo_description: "",
      page_title: "",
      canonical_url: "",
    },
    svgForm: {
      images: [],
    },
    prices: { // Add this field
      prices: [],
    }
  };
};

const extractPrices = (prices: any) => {
  const extractedPrices: { currency_code: string; amount: number }[] = [];

  for (const currencyCode in prices) {
    if (Object.prototype.hasOwnProperty.call(prices, currencyCode)) {
      const price = prices[currencyCode];
      const amt = price.amount * 100
      extractedPrices.push({
        currency_code: currencyCode,
        amount: parseInt(amt.toString(), 10),
      });
    }
  }

  return extractedPrices;
};

const getVariantPrices = (prices: PricesFormType) => {
  return prices.prices
    .filter((price) => typeof price.amount === "number")
    .map((price) => {
      return {
        amount: price.amount as number,
        currency_code: price.region_id ? undefined : price.currency_code,
        region_id: price.region_id || undefined,
      }
    });
};

export default NewProduct
