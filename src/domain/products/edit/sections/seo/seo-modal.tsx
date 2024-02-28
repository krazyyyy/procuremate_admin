import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { nestedForm } from "../../../../../utils/nested-form"
import SeoForm, { SeoFormType } from "../../../components/seo-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type SeoFormWrapper = {
  seoForm: SeoFormType
}

const SeoModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<SeoFormWrapper>({
    defaultValues: getDefaultValues(product),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        metadata : {
          seo_title: data.seoForm.seo_title,
          page_title: data.seoForm.page_title,
          seo_description: data.seoForm.seo_description,
          canonical_url: data.seoForm.canonical_url,
        }
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            Edit SEO Information
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <SeoForm form={nestedForm(form, "seoForm")} />
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
                loading={updating}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): SeoFormWrapper => {
  return {
    metadata : {
      seo_title: product?.metadata?.seo_title || "",
      page_title: product?.metadata?.page_title || "",
      seo_description: product?.metadata?.seo_description || "",
      canonical_url: product?.metadata?.canonical_url | "",
    },
  }
}

export default SeoModal
