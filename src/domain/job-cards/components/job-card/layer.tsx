import { LineItem } from "@medusajs/medusa"
import React from "react"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { useEffect, useState } from "react"
import Medusa from "../../../../services/api"

type LayerLineProps = {
  item: LineItem
  currencyCode: string
}

const LayerLine = ({ item, currencyCode }: LayerLineProps) => {
  const isHexCode = (value) => {
    const hexCodeRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexCodeRegex.test(value);
  };
  
  return (
    <div className="flex justify-between mb-1 py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
      <div className="flex space-x-4 justify-center">
      <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
          {item?.image_url && isHexCode(item?.image_url) ? (
            <div
              className="w-full h-full"
              style={{ backgroundColor: item?.image_url }}
            ></div>
          ) : item?.image_url ? (
            <img src={item?.image_url} alt="Product" className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>


        <div className="flex flex-col justify-center max-w-[185px]">
        <span className="text-small font-bold leading-[18px]">
          {item?.layer_name} {item?.id?.includes("text")&& item?.metadata && item?.metadata?.name_settings && ` - ${item?.metadata?.name_settings?.title}`}
        </span>
        <span className="text-small leading-[12px]">
          {item?.name}
        </span>
        <span className="text-xsmall leading-[12px]">
        {item?.area_size?.title}
        </span>
        {item?.id === "size" && item?.metadata && 
        <span className="text-xsmall leading-[12px]">
        Height: {item?.metadata?.height}
        </span>
        }
        {item?.id === "graphic" && item?.metadata && item?.metadata?.size && 
        <span className="text-xsmall leading-[12px]">
         {item?.metadata?.size?.title}
        </span>
        }
        {item?.id === "graphic" && item?.metadata && item?.metadata?.size && 
        <span className="text-xsmall leading-[12px]">
         {item?.metadata?.size?.description}
        </span>
        }
        {item?.id === "size" && item?.metadata && 
        <span className="text-xsmall leading-[12px]">
        Weight: {item?.metadata?.width}
        </span>
        }

        {item?.id?.includes("text") && item?.metadata && 
        <span className="text-xsmall leading-[12px]">
          Text: {item?.metadata?.text}
        </span>
            
        }
        {item?.id?.includes("text") && item?.metadata && 
        <span className="text-xsmall leading-[12px]">
          Font: {item?.metadata?.fontFamily}
        </span>
            
        }
        {item?.id?.includes("text") && item?.metadata && item?.metadata?.color && 
        <span className="text-xsmall leading-[12px]">
          Fill: {item?.metadata?.color?.title}
        </span>
            
        }
        {item?.id?.includes("text") && item?.metadata && item?.metadata?.finish && 
        <span className="text-xsmall leading-[12px]">
          Finish: {item?.metadata?.finish?.title}
        </span>
            
        }
        {item?.id?.includes("text") && item?.metadata && item?.metadata?.patch && item?.metadata?.patch_color && 
        <span className="text-xsmall leading-[12px]">
          Patch: {item?.metadata?.patch_color?.title}
        </span>
            
        }
        {item?.id?.includes("text") && item?.metadata && item?.metadata?.outline && 
        <span className="text-xsmall leading-[12px]">
          Outline: {item?.metadata?.outline_color?.title}
        </span>
            
        }


        </div>
      </div>
      <div className="flex  items-center">
        <div className="flex small:space-x-2 medium:space-x-4 large:space-x-6 mr-3">
          <div className="inter-small-regular text-grey-90">
              {/* {item?.price} */}
            {formatAmountWithSymbol({
              amount: item?.price * 100 ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default LayerLine
