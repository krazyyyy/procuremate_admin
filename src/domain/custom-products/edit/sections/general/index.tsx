import { Product, ProductVariant } from "@medusajs/medusa"
import React, { useState } from "react"
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
import GeneralModal from "./general-modal"
import { formatAmountWithSymbol } from "../../../../../utils/prices"
import { formatAmount } from "medusa-react"
import EditVariantsModal from "../variants/edit-variants-modal"
import EditVariantModal from "../variants/edit-variant-modal"
type Props = {
  product: Product
}

const GeneralSection = ({ product }: Props) => {
  const { onDelete, onStatusChange } = useEditProductActions(product.id)
  const [variantToEdit, setVariantToEdit] = useState<
  { base: ProductVariant; isDuplicate: boolean } | undefined
>(undefined)
  const {
    state: infoState,
    close: closeInfo,
    toggle: toggleInfo,
  } = useToggleState()

  const {
    state: editVariantsState,
    close: closeEditVariants,
    toggle: toggleEditVariants,
  } = useToggleState()
  const {
    state: channelsState,
    close: closeChannels,
    toggle: toggleChannels,
  } = useToggleState(false)

  const { isFeatureEnabled } = useFeatureFlag()
  const handleEditVariant = () => {
    setVariantToEdit({ base: product?.variants[0], isDuplicate: false })
  }

  const actions: ActionType[] = [
    {
      label: "Edit General Information",
      onClick: toggleInfo,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Edit Inventory",
      onClick: toggleEditVariants,
      icon: <EditIcon size="20" />,
    },
    {
      label: "Edit Pricing",
      onClick: handleEditVariant,
      icon: <EditIcon size="20" />,
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
        title={product.title}
        actions={actions}
        forceDropdown
        status={
          <StatusSelector
            isDraft={product?.status === "draft"}
            activeState="Published"
            draftState="Draft"
            onChange={() => onStatusChange(product.status)}
          />
        }
      >
        <p className="mt-2 whitespace-pre-wrap inter-base-regular text-grey-50">
          {product.description}
        </p>
        <ProductTags product={product} />
        <ProductDetails product={product} />

      </Section>

      <GeneralModal product={product} open={infoState} onClose={closeInfo} />
      <EditVariantsModal
        open={editVariantsState}
        onClose={closeEditVariants}
        product={product}
      />
      {variantToEdit && (
        <EditVariantModal
          variant={variantToEdit.base}
          isDuplicate={variantToEdit.isDuplicate}
          product={product}
          onClose={() => setVariantToEdit(undefined)}
        />
      )}

    </>
  )
}

type DetailProps = {
  title: string
  value?: string | number | null
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
      <Detail title="Subtitle" value={product.subtitle} />
      <Detail title="Handle" value={product.handle} />
{ product?.variants[0]?.prices.map((price) =>

      <Detail
          title="Price"
          value={
              formatAmountWithSymbol({
                amount: price?.amount,
                currency: price?.currency_code,
                digits: 2,
              })
            }
              />
          )
    }
      {/* <Detail title="Price" value={formatAmountWithSymbol({
                    amount: product?.variants[0]?.prices[0]?.amount,
                    currency: product?.variants[0]?.prices[0]?.currency_code,
                    digits: 2,
                  })}/> */}
      <Detail title="Code" value={product?.variants[0]?.sku} />
      <Detail title="Quantity" value={product?.variants[0]?.inventory_quantity} />
      <Detail title="Collection" value={product.collection?.title} />
    </div>
  )
}

const ProductTags = ({ product }: Props) => {
  if (product.tags?.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-wrap items-center gap-1 mt-4">
      {product.tags.map((t) => (
        <li key={t.id}>
          <div className="text-grey-50 bg-grey-10 inter-small-semibold px-3 py-[6px] rounded-rounded">
            {t.value}
          </div>
        </li>
      ))}
    </ul>
  )
}



export default GeneralSection
