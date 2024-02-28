import { Product } from "@medusajs/medusa"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { FormImage } from "../../../../../types/shared"
import { prepareImages } from "../../../../../utils/images"
import { nestedForm } from "../../../../../utils/nested-form"
import SVGForm, { SVGFormType } from "../../../components/svg-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import Medusa from "../../../../../services/api"
import copy from "copy-to-clipboard"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
  setObjectList : {}
  objectList: []
  setIds: React.Dispatch<React.SetStateAction<string[]>>
}

type SVGFormWrapper = {
  SVG: SVGFormType
}

const SVGModal = ({ product, open, onClose, setObjectList, objectList, setIds }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<SVGFormWrapper>({
    defaultValues: getDefaultValues(product),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form
  const notification = useNotification()

  const createProductSettings = async (settings) => {
    await Medusa.customProductSetting.create(settings)
  }

  const [copyObj, setObj] = useState([])

  useEffect(() => {
    reset(getDefaultValues(product))
    setObj(objectList)
  }, [product])
  const getProductSettings = async () => {
    const data = await Medusa.customProductSetting.list(`?product_id=${product.id}`);
    setIds(data.data.custom_product_settings.custom_product_settings);
  };
  const [loading, isLoading] = useState(false)
  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }
  const onSubmit = handleSubmit(async (data) => {
    isLoading(true)
    let preppedImages: FormImage[] = []
    const files = data.SVG.images.map((i) => i.nativeFile)
    const response = await Medusa.uploadSvg.create(files)
    
    const urls = response.data['url']
    await Medusa.products.update(product.id, { metadata : {
      template_image : urls
    }})
    // const deletePromises = copyObj.map((i) => Medusa.customProductSetting.delete(i.id));
    // const createPromises = objectList.map((i) => {
    //   const { id, ...rest } = i;
    //   const item = rest;
    //   return createProductSettings(item);
    // });
    // await Promise.all([...deletePromises, ...createPromises]);
    const delete_data = await Medusa.customProductSetting.list(`?product_id=${product.id}`);
    const deletePromises = delete_data.data.custom_product_settings.custom_product_settings.map(async (i) => {
      await Medusa.customProductSetting.delete(i.id);
    });
  
    const createPromises = objectList.map(async (i) => {
      const { id, ...rest } = i;
      const item = rest;
      await createProductSettings(item);
    });
  
    // Wait for all delete and create promises to resolve
    await Promise.all([...deletePromises, ...createPromises]);
  
    // Call getProductSettings after all promises are resolved
    await getProductSettings();
  
    onUpdate(
      {
        // @ts-ignore
      },
      onReset
    );
  
    isLoading(false);
  })
  
  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Edit Custom Template</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
              <h2 className="inter-large-semibold mb-2xsmall">Custom Template</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Add images to your Custom Template.
              </p>
              <div>
                <SVGForm form={nestedForm(form, "SVG")} setIds={setIds} is_svg={true}/>
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-x-2 justify-end w-full">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={loading}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): SVGFormWrapper => {
  return {
    SVG: {
      images:[
       {
          url: product?.metadata?.template_image,
          selected: false,
        }] || [],
    },
  }
}

export default SVGModal
