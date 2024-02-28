import { useParams } from "react-router-dom"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react"
import BodyCard from "../../../components/organisms/body-card"
import Tooltip from "../../../components/atoms/tooltip"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import moment from "moment"
import ThumbnailSection from "../components/job-card/thumbnail"

import LayerLine from "../components/job-card/layer"
import "../../../assets/styles/global.css"


import { Address } from "@medusajs/medusa"

type FormattedAddressProps = {
  title: string
  addr?: Address
}
const FormattedAddressLine = ({ title, addr }: FormattedAddressProps) => {
  if (!addr) {
    return (
      <div className="flex flex-col pl-6">
        <div className="inter-small-regular mb-1 text-grey-50">{title}</div>
        <div className="inter-small-regular flex flex-col">N/A</div>
      </div>
    )
  }

  return (
    <div>
      <div className="inter-small-regular">
        {" "}
        <span className="font-bold">{title}</span> :
        <span>
          {addr?.address_1} {addr?.address_2} -{addr?.postal_code} {addr?.city}
          {", "}
          {addr?.province ? `${addr.province} ` : ""}
          {addr?.country_code?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

const JobCardPrint = () => {
  const { id } = useParams()
  const [commentList, getComments] = useState([])
  const getAllComments = async () => {
    const comments = await Medusa.jobCardComment.list(
      100,
      1,
      `job_card_id=${id}`
    )
    getComments(comments.data.job_card_comment.job_card_comment)
  }
  interface Item {
    order_id: Record<string, any>
    product_id: Record<string, any>
  }
  const [item, setItem] = useState<Item>({
    order_id: {},
    product_id: {},
  })
  const [design, setDesign] = useState<any>()

  const getData = async () => {
    const data = await Medusa.jobCards.retrieve(id)

    setItem(data.data.job_card)
    getAllComments()
    setDesign(data.data?.job_card?.custom_design_id)
    setLoading(false)
    setTimeout(() => {
      window.print()
    }, 800)
  }

  useEffect(() => {
    getData()
  }, [])

  const [isLoadingData, setLoading] = useState(true)

  if (isLoadingData) {
    return (
      <BodyCard className="flex w-full items-center justify-center pt-2xlarge">
        <Spinner size={"large"} variant={"secondary"} />
      </BodyCard>
    )
  }

  return (
    <div className="">
      {isLoadingData || !item ? (
        <BodyCard className="flex w-full items-center justify-center pt-2xlarge ">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <>
          <div
            id="printableDiv"
            className="printable-content flex justify-center"
          >
            <div className="printable-section flex h-full w-1/2 flex-col">
              <BodyCard
                className={"sm-box printable-section mb-4 w-full"}
                customHeader={
                  <Tooltip side="top" content={"Copy ID"}>
                    <button className="inter-xlarge-semibold flex cursor-pointer items-center text-grey-90 active:text-violet-90">
                      #{item?.order_id?.display_id}{" "}
                      <ClipboardCopyIcon size={16} />
                    </button>
                  </Tooltip>
                }
                subtitle={moment(item?.order_id?.created_at).format(
                  "D MMMM YYYY hh:mm a"
                )}
                forceDropdown={true}
              >
                <div className="mt-6 flex space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-smaller-regular mb-1 text-grey-50">
                      Email
                    </div>
                    <button className="flex cursor-pointer items-center gap-x-1 text-grey-90 active:text-violet-90">
                      {item?.order_id?.email}
                      <ClipboardCopyIcon size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex ">
                  <div className="flex flex-col">
                    <FormattedAddressLine
                      title={"Shipping"}
                      addr={item?.order_id?.shipping_address}
                    />
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col">
                    <div>
                      <span className="font-bold">Due Date</span>
                      <span>
                        {moment(item?.order_id?.metadata?.due_date).format(
                          "D MMMM YYYY"
                        ) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col">
                    <div>
                      <span className="font-bold">Send Date</span>
                      <span>
                        {moment(item?.order_id?.metadata?.send_date).format(
                          "D MMMM YYYY"
                        ) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col">
                    <div>
                      <span className="font-bold">Phone</span>
                      <span>
                        {item?.order_id?.shipping_address?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </BodyCard>
              {design && design?.length !== 0 && (
                <ThumbnailSection
                  customer_id={design?.customer_id}
                  custom_design_id={design?.id}
                  product_id={item?.product_id?.id}
                  image={design?.design_data?.png || design?.design_data?.svg}
                  title=""
                />
              )}
              <BodyCard
                className={"printable-section h-auto min-h-0 w-full"}
                title="Comments"
              >
                <div className="mt-6">
                  <div className="mt-4 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-small-regular mb-1 text-grey-50">
                        Customer Comments
                      </div>
                      <div
                        className="inter-small-regular flex flex-col"
                        style={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          borderBottom: "1px dotted #ccc",
                        }}
                      >
                        <p style={{ wordWrap: "break-word" }}>
                          <p>{item?.order_id?.metadata?.comment}</p>
                        </p>
                        <div className="inter-small-regular mb-1 text-grey-50">
                          Admin Comments
                        </div>
                        {commentList &&
                          commentList.map((comment: any, index) => (
                            <div
                              className="inter-small-regular flex flex-col"
                              key={index}
                              style={{
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                borderBottom: "1px dotted #ccc",
                              }}
                            >
                              <p style={{ wordWrap: "break-word" }}>
                                {comment?.comment}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div></div>
                  </div>
                  <div></div>
                </div>
              </BodyCard>
            </div>
            <div className="ml-2 flex h-full w-1/2 flex-wrap">
              <div className="printable-section w-full">
                <BodyCard
                  className={"summary mb-4 h-auto min-h-0 w-full"}
                  title="Summary"
                >
                  <div className="sm-box mt-6">
                    {design?.design_data?.design?.map((obj, i) => (
                      <LayerLine
                        key={i}
                        item={obj}
                        // currencyCode={item?.order_id?.currency_code}
                        currencyCode={item?.order_id?.currency_code}
                      />
                    ))}
                  </div>
                </BodyCard>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default JobCardPrint
