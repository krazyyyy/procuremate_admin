import { Product } from "@medusajs/medusa"
import React from "react"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import SvgModal from "./svg-modal"

type Props = {
  product: Product
  setObjectList: {}
  objectList: []
  setIds: React.Dispatch<React.SetStateAction<string[]>>
}

const SvgSection = ({ product, setObjectList, objectList, setIds }: Props) => {
  const { state, close, toggle } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Template",
      onClick: toggle,
    },
  ]

  return (
    <>
      <Section title="Template" actions={actions}>
        {product.metadata && typeof product.metadata !== undefined && product.metadata.hasOwnProperty('template_image') && (
          <div className="grid grid-cols-3 gap-xsmall mt-base">
              <div
                  key={product.metadata.template_image}
                  className="aspect-square flex items-center justify-center"
                >
                  <img
                    src={product.metadata.template_image}
                    alt={`Image ${1}`}
                    className="object-contain rounded-rounded max-w-full max-h-full"
                  />
                </div>
          </div>
        )}
      </Section>

      <SvgModal product={product} open={state} setObjectList={setObjectList} setIds={setIds} objectList={objectList} onClose={close} />
    </>
  )
}

export default SvgSection
