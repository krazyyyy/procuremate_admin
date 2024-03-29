import React from "react"
import { NestedForm } from "../../../../../utils/nested-form"
import PricesForm, { PricesFormType } from "../../prices-form"

type Props = {
  form: NestedForm<PricesFormType>
}

const VariantPricesForm = ({ form }: Props) => {
  return (
    <div>
      <div className="pt-large">
        <PricesForm form={form} />
      </div>
    </div>
  )
}

export default VariantPricesForm
