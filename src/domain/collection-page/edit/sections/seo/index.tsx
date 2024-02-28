import { Product, SalesChannel } from "@medusajs/medusa"
import React from "react"
import Badge from "../../../../../components/fundamentals/badge"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import ChannelsIcon from "../../../../../components/fundamentals/icons/channels-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import SalesChannelsDisplay from "../../../../../components/molecules/sales-channels-display"
import StatusSelector from "../../../../../components/molecules/status-selector"
import Section from "../../../../../components/organisms/section"
import { useFeatureFlag } from "../../../../../context/feature-flag"
import useToggleState from "../../../../../hooks/use-toggle-state"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import SeoModal from "./seo-modal"

type Props = {
  product: Product
}

const SeoSection = ({ product }: Props) => {
  const { onDelete, onStatusChange } = useEditProductActions(product.id)
  const {
    state: infoState,
    close: closeInfo,
    toggle: toggleInfo,
  } = useToggleState()

  const {
    state: channelsState,
    close: closeChannels,
    toggle: toggleChannels,
  } = useToggleState(false)

  const { isFeatureEnabled } = useFeatureFlag()

  const actions: ActionType[] = [
    {
      label: "Edit SEO Information",
      onClick: toggleInfo,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]


  return (
    <>
      <Section
        title="Seo"
        actions={actions}
        forceDropdown
      >
        <p className="mt-2 whitespace-pre-wrap inter-base-regular text-grey-50">
          {product.description}
        </p>
        <ProductDetails product={product} />
      </Section>

      <SeoModal product={product} open={infoState} onClose={closeInfo} />

 
    </>
  )
}

type DetailProps = {
  title: string
  value?: string | null
}

const Detail = ({ title, value }: DetailProps) => {
  return (
    <div className="flex items-center justify-between inter-base-regular text-grey-50">
      <p>{title}</p>
      <p>{value ? value : "–"}</p>
    </div>
  )
}

const ProductDetails = ({ product }: Props) => {
  return (
    <div className="flex flex-col mt-8 gap-y-3">
      <h2 className="inter-base-semibold">Details</h2>
      <SeoComp Seo="Seo Title" value={product?.metadata?.seo_title} />
      <SeoComp Seo="Page Title" value={product?.metadata?.page_title} />
      <SeoComp Seo="Seo Description" value={product?.metadata?.seo_description} />
      <SeoComp Seo="Canonical Url" value={product?.metadata?.canonical_url} />
    </div>
  )
}


type SeoProps = {
  Seo: string
  value: string | number | null
}

const SeoComp = ({ Seo, value }: SeoProps) => {
  return (
    <div className="flex items-center justify-between w-full inter-base-regular text-grey-50">
      <p>{Seo}</p>
      <p>{value || "–"}</p>
    </div>
  )
}

export default SeoSection
