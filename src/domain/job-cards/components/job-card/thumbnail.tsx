import clsx from "clsx"
import React from "react"
import Section from "../../../../components/organisms/section"

const SVGRenderer = ({
  url,
  height = 400,
  width = 400,
}: {
  url: string
  height?: number
  width?: number
}) => {
  return (
    <object width={width} height={height} type="image/svg+xml" data={url} />
  )
}
const ThumbnailSection = ({
  image,
  title,
  product_id,
  custom_design_id,
  customer_id,
}: {
  image: string
  title?: string
  product_id: string
  custom_design_id: string
  customer_id: string
}) => {
  // const height = "450px"
  // const width = "465px"
  return (
    <>
      <Section title="Template">
        <div className={clsx("mt-base grid gap-xsmall", { hidden: !image })}>
          {image ? (
            <div
              id="svgTemp"
              className="relative flex aspect-square items-center justify-center"
            >
              {/* <img
            src={image}
          /> */}
              <SVGRenderer url={image} />
              {/* <ReactSVG
            src={image}
            style={{ maxWidth: '100%', maxHeight: '100%',  }}
            className="z-10"
          /> */}

              {/* <img src={image} alt="SVG Image" /> */}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 480"
                dangerouslySetInnerHTML={{ __html: image }}
              />
            </div>
          )}
        </div>
        {/* <div>
          <a
            href={`https://www.fiercefightgear.com/customizer/app?id=${product_id}&design_id=${custom_design_id}&customer_id=${customer_id}`}
          >
            Edit Design
          </a>
        </div> */}
      </Section>
    </>
  )
}

export default ThumbnailSection
