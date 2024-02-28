import { useNavigate, useParams } from "react-router-dom"
import Spinner from "../../../components/atoms/spinner"
import Medusa from "../../../services/api"
import { useEffect, useState } from "react"
import Button from "../../../components/fundamentals/button"
import useNotification from "../../../hooks/use-notification"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import Tooltip from "../../../components/atoms/tooltip"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import { OrderStatusComponent } from "../../orders/details/templates"
import ClockIcon from "../../../components/fundamentals/icons/clock-icon"
import DatePicker from "../../../components/atoms/date-picker/date-picker"
import useClipboard from "../../../hooks/use-clipboard"
import { capitalize } from "lodash"
import moment from "moment"
import ThumbnailSection from "../components/job-card/thumbnail"
import Avatar from "../../../components/atoms/avatar"
import { FormattedAddress } from "../../orders/details/templates"
import extractCustomerName from "../../../utils/extract-customer-name"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import { isoAlpha2Countries } from "../../../utils/countries"
import { PaymentStatusComponent } from "../../orders/details/templates"
import { formatAmountWithSymbol } from "../../../utils/prices"
import { DisplayTotal } from "../../orders/details/templates"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import { ActionType } from "../../../components/molecules/actionables"
import LayerLine from "../components/job-card/layer"
import TextArea from "../../../components/molecules/textarea"
import { FulfillmentStatusComponent } from "../../orders/details/templates"
import CreateFulfillmentModal from "../../orders/details/create-fulfillment"
import { Swap } from "@medusajs/medusa"
import { Fulfillment } from "@medusajs/medusa"
import { ClaimOrder } from "@medusajs/medusa"
import { useAdminOrder, useMeCustomer } from "medusa-react"

type OrderDetailFulfillment = {
  title: string
  type: string
  fulfillment: Fulfillment
  swap?: Swap
  claim?: ClaimOrder
}

const gatherAllFulfillments = (order) => {
  if (!order) {
    return []
  }

  const all: OrderDetailFulfillment[] = []

  order?.fulfillments?.forEach((f, index) => {
    all.push({
      title: `Fulfillment #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  return all
}
interface Item {
  order_id: Record<string, any>
  product_id: Record<string, any>
}

const JobCard = () => {
  const { id } = useParams()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [openDatePicker, setOpenDatePicker] = useState(null)
  const [showFulfillment, setShowFulfillment] = useState(false)

  const handleDivClick = (dateField) => {
    setOpenDatePicker(dateField)
  }
  const navigate = useNavigate()

  const handleDateChange = async () => {
    try {
      if (openDatePicker === "due_date") {
        await Medusa.orders.update(id, {
          metadata: {
            due_date: selectedDate.toISOString(),
          },
        })
        // Handle successful update for the due_date field
      } else if (openDatePicker === "send_date") {
        await Medusa.orders.update(id, {
          metadata: {
            send_date: selectedDate.toISOString(),
          },
        })
        // Handle successful update for the send_date field
      }

      // Perform any other necessary actions or notifications for a successful update

      setOpenDatePicker(null) // Close the open DatePicker
    } catch (error) {
      // Handle any errors that occur during the update process
      console.error("Error updating date:", error)
    }
  }

  const [isLoadingData, setLoading] = useState(true)

  const [item, setItem] = useState<Item>({
    order_id: {},
    product_id: {},
  })
  const [design, setDesign] = useState([])
  const { customer } = useMeCustomer()

  const getData = async () => {
    const data = await Medusa.jobCards.retrieve(id)

    setItem(data.data.job_card)
    setDesign(data.data?.job_card?.custom_design_id)
    console.log(data.data?.job_card?.custom_design_id?.design_data?.design)
    setLoading(false)
  }
  const notification = useNotification()

  const [, handleCopy] = useClipboard(`${item?.order_id?.display_id!}`, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Order ID copied", "success"),
  })

  const [, handleCopyEmail] = useClipboard(item?.order_id?.email!, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Email copied", "success"),
  })

  // const onSubmit = async () => {
  //   const formData = form.getValues();
  //   const sizing_data = (formData.guide)
  //   try {
  //     const response = await Medusa.sizeGuide.update(id ,sizing_data)

  //     formData.sizing.map(async (size) => {
  //       const { size_id, ...rest } = size;
  //       if (size_id) {
  //           const resp = await Medusa.sizeColumn.update(size_id ,rest)
  //         } else {
  //           size.size_key = id || ""
  //           const resp = await Medusa.sizeColumn.create(rest)
  //         }
  //     })
  //     notification("success", "Succesfully Updated", "success")

  // } catch  (err){
  //   notification("Error",  "Unknown Error", "error")

  //   }
  // }

  const customerActionables: ActionType[] = [
    {
      label: "Go to Customer",
      icon: <DetailsIcon size={"20"} />,
      onClick: () => navigate(`/a/customers/${item?.order_id?.customer.id}`),
    },
  ]
  const [commentList, getComments] = useState([])
  const [comment, setComment] = useState("")

  const addComment = async () => {
    await Medusa.jobCardComment.create({
      comment: comment,
      job_card_id: id,
    })
    // Fetch the newly created comment
    const newComment = { comment: comment }

    // Append the new comment to the existing commentList
    getComments([...commentList, newComment])
    setComment("")
  }

  const getAllComments = async () => {
    const comments = await Medusa.jobCardComment.list(
      100,
      1,
      `job_card_id=${id}`
    )
    getComments(comments.data.job_card_comment.job_card_comment)
  }

  useEffect(() => {
    getData()
    getAllComments()
  }, [])
  const { order, isLoading } = useAdminOrder(item?.order_id?.id!)
  const allFulfillments = gatherAllFulfillments(order)
  if (isLoadingData) {
    return (
      <BodyCard className="flex w-full items-center justify-center pt-2xlarge">
        <Spinner size={"large"} variant={"secondary"} />
      </BodyCard>
    )
  }

  console.log(item)

  return (
    <div id="printDT" className="">
      <Breadcrumb
        currentPage={"Job Card Details"}
        previousBreadcrumb={"Job Card"}
        previousRoute="/a/job-cards"
      />
      {isLoadingData || !item ? (
        <BodyCard className="flex w-full items-center justify-center pt-2xlarge">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <>
          <div className="flex space-x-4">
            <div className="flex h-full w-1/2 flex-col">
              <BodyCard
                className={"mb-4 min-h-[200px] w-full"}
                customHeader={
                  <Tooltip side="top" content={"Copy ID"}>
                    <button
                      className="inter-xlarge-semibold flex cursor-pointer items-center gap-x-2 text-grey-90 active:text-violet-90"
                      onClick={handleCopy}
                    >
                      #{item?.order_id?.display_id}{" "}
                      <ClipboardCopyIcon size={16} />
                    </button>
                  </Tooltip>
                }
                subtitle={moment(item?.order_id?.created_at).format(
                  "D MMMM YYYY hh:mm a"
                )}
                status={
                  <OrderStatusComponent status={item?.order_id?.status} />
                }
                forceDropdown={true}
              >
                <div className="mt-6 flex space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-smaller-regular mb-1 text-grey-50">
                      Email
                    </div>
                    <button
                      className="flex cursor-pointer items-center gap-x-1 text-grey-90 active:text-violet-90"
                      onClick={handleCopyEmail}
                    >
                      {item?.order_id?.email}
                      <ClipboardCopyIcon size={12} />
                    </button>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular mb-1 text-grey-50">
                      Phone
                    </div>
                    <div>
                      {item?.order_id?.shipping_address?.phone || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular mb-1 text-grey-50">
                      Payment
                    </div>
                    <div>
                      {item?.order_id?.payments
                        ?.map((p) => capitalize(p.provider_id))
                        .join(", ")}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-smaller-regular mb-1 text-grey-50">
                      Due Date
                    </div>
                    <div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleDivClick("due_date")}
                          className="flex items-center text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
                        >
                          <ClockIcon className="mr-1 h-5 w-5" />
                          {moment(item?.order_id?.metadata?.due_date || "N/A").format(
                            "D MMMM YYYY"
                          ) || "N/A"}
                        </button>
                      </div>

                      {openDatePicker === "due_date" && (
                        <DatePicker
                          key="due_date_picker"
                          date={selectedDate}
                          onSubmitDate={handleDateChange}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular mb-1 text-grey-50">
                      Send Date
                    </div>
                    <div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleDivClick("send_date")}
                          className="flex items-center text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
                        >
                          <ClockIcon className="mr-1 h-5 w-5" />
                          <div>
                            {moment(item?.order_id?.metadata?.send_date || "N/A").format(
                              "D MMMM YYYY"
                            ) || "N/A"}
                          </div>
                        </button>
                      </div>

                      {openDatePicker === "send_date" && (
                        <DatePicker
                          key="send_date_picker"
                          date={selectedDate}
                          onSubmitDate={handleDateChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </BodyCard>
              <BodyCard
                className={"mb-4 h-auto min-h-0 w-full"}
                title="Summary"
              >
                <div className="mt-6">
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
              <BodyCard
                className={"mb-4 h-auto min-h-0 w-full"}
                title="Customer"
                actionables={customerActionables}
              >
                <div className="mt-6">
                  <div className="flex w-full items-center space-x-4">
                    <div className="flex h-[40px] w-[40px] ">
                      <Avatar
                        user={item?.order_id?.customer.id}
                        font="inter-large-semibold"
                        color="bg-fuschia-40"
                      />
                    </div>
                    <div>
                      <h1 className="inter-large-semibold text-grey-90">
                        {extractCustomerName(item?.order_id)}
                      </h1>
                      {item?.order_id?.shipping_address && (
                        <span className="inter-small-regular text-grey-50">
                          {item?.order_id?.shipping_address.city},{" "}
                          {
                            isoAlpha2Countries[
                              item?.order_id?.shipping_address.country_code?.toUpperCase()
                            ]
                          }
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-small-regular mb-1 text-grey-50">
                        Contact
                      </div>
                      <div className="inter-small-regular flex flex-col">
                        <span>{item?.order_id?.email}</span>
                        <span>
                          {item?.order_id?.shipping_address?.phone || ""}
                        </span>
                      </div>
                    </div>
                    <FormattedAddress
                      title={"Shipping"}
                      addr={item?.order_id?.shipping_address}
                    />
                    <FormattedAddress
                      title={"Billing"}
                      addr={item?.order_id?.billing_address}
                    />
                  </div>
                  <div className="mt-6 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-small-regular mb-1 text-grey-50">
                        Customer Comments
                      </div>
                      <div className="inter-small-regular flex flex-col">
                        <p>{item?.order_id?.metadata?.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </BodyCard>
              <BodyCard
                className={"mb-4 h-auto min-h-0 w-full"}
                title="Order Status"
                status={
                  <FulfillmentStatusComponent
                    status={item?.order_id?.metadata?.status || ""}
                  />
                }
                customActionable={
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setShowFulfillment(true)}
                  >
                    Update Status
                  </Button>
                }
              ></BodyCard>
              <BodyCard
                className={"mb-4 h-auto min-h-0 w-full"}
                title="Admin Comments"
              >
                <div className="mt-6">
                  <div className="mt-6 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-small-regular mb-1 text-grey-50">
                        Admin Comments
                      </div>
                      {commentList &&
                        commentList.map((comment, index) => (
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
                  <div>
                    <TextArea
                      label="Add Comments"
                      placeholder="A warm and cozy jacket..."
                      rows={3}
                      className="mb-small"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="float-right"
                    onClick={addComment}
                  >
                    Add Comment
                  </Button>
                </div>
              </BodyCard>
            </div>
            <div className="flex h-full w-1/3 flex-wrap">
              <div className="w-full">
                {design && design?.length !== 0 && (
                  <ThumbnailSection
                    customer_id={item?.order_id?.customer.id}
                    custom_design_id={design?.id}
                    product_id={item?.product_id?.id}
                    image={design?.design_data?.png || design?.design_data?.svg}
                    title=""
                  />
                )}
              </div>
              <div className="mt-2 w-full">
                <BodyCard
                  className={"mb-4 h-auto min-h-0 w-full"}
                  title="Payment"
                  status={
                    <PaymentStatusComponent
                      status={item?.order_id?.payment_status}
                    />
                  }
                >
                  <div className="mt-6">
                    {item?.order_id?.payments.map((payment) => (
                      <div className="flex flex-col" key={payment.id}>
                        <DisplayTotal
                          currency={item?.order_id?.currency_code}
                          totalAmount={payment.amount}
                          totalTitle={payment.id}
                          subtitle={`${moment(payment.created_at).format(
                            "DD MMM YYYY hh:mm"
                          )}`}
                        />
                        {!!payment.amount_refunded && (
                          <div className="mt-4 flex justify-between">
                            <div className="flex">
                              <div className="mr-2 text-grey-40">
                                <CornerDownRightIcon />
                              </div>
                              <div className="inter-small-regular text-grey-90">
                                Refunded
                              </div>
                            </div>
                            <div className="flex">
                              <div className="inter-small-regular mr-3 text-grey-90">
                                -
                                {formatAmountWithSymbol({
                                  amount: payment.amount_refunded,
                                  currency: item?.order_id?.currency_code,
                                })}
                              </div>
                              <div className="inter-small-regular text-grey-50">
                                {order?.currency_code?.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="mt-4 flex justify-between">
                      <div className="inter-small-semibold text-grey-90">
                        Total Paid
                      </div>
                      <div className="flex">
                        <div className="inter-small-semibold mr-3 text-grey-90">
                          {formatAmountWithSymbol({
                            amount: item?.order_id?.paid_total - item?.order_id?.refunded_total,
                            currency: item?.order_id?.currency_code,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          {item?.order_id?.currency_code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </BodyCard>
              </div>
              {/* <Timeline orderId={item?.order_id?.id} /> */}
            </div>
            {showFulfillment && (
              <CreateFulfillmentModal
                orderToFulfill={item?.order_id as any}
                handleCancel={() => setShowFulfillment(false)}
                orderId={item?.order_id.id}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default JobCard
