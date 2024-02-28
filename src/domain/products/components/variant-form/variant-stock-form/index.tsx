import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import InputField from "../../../../../components/molecules/input"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantStockFormType = {
  manage_inventory: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
}

type Props = {
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({ form }: Props) => {
  const {
    path,
    control,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configure the inventory and stock for this variant.
      </p>
      <div className="pt-large flex flex-col gap-y-xlarge">

        <div className="grid grid-cols-2 gap-large">
          <InputField
            label="Stock keeping unit (SKU)"
            placeholder="SUN-G, JK1234..."
            {...register(path("sku"))}
          />
          <InputField
            label="Quantity in stock"
            type="number"
            placeholder="100..."
            errors={errors}
            {...register(path("inventory_quantity"), {
              valueAsNumber: true,
            })}
          />

        </div>
      </div>
    </div>
  )
}

export default VariantStockForm
