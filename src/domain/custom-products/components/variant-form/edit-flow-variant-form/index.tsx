import React from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import Accordion from "../../../../../components/organisms/accordion"
import { nestedForm } from "../../../../../utils/nested-form"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import { PricesFormType } from "../../prices-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantPricesForm from "../variant-prices-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

export type EditFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: {
    title: string
    value: string
    id: string
  }[]
  customs: CustomsFormType
  dimensions: DimensionsFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const EditFlowVariantForm = ({ form }: Props) => {
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="Pricing" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
      </Accordion.Item>
    </Accordion>
  )
}

export default EditFlowVariantForm
