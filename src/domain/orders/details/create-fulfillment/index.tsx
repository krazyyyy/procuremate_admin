import {
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  ClaimOrder,
  Order,
  Swap,
} from "@medusajs/medusa"
import {
  useAdminCreateFulfillment,
  useAdminFulfillClaim,
  useAdminFulfillSwap,
} from "medusa-react"
import React, { useState, useEffect } from "react"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import Metadata, {
  MetadataField,
} from "../../../../components/organisms/metadata"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import CreateFulfillmentItemsTable from "./item-table"
import Medusa from "../../../../services/api"
import async from "react-select/dist/declarations/src/async/index"


type CreateFulfillmentModalProps = {
  handleCancel: () => void
  address?: object
  email?: string
  orderToFulfill: Order | ClaimOrder | Swap
  orderId: string
}


const CreateFulfillmentModal: React.FC<CreateFulfillmentModalProps> = ({
  handleCancel,
  orderToFulfill,
  orderId,
}) => {
  const [toFulfill, setToFulfill] = useState<string[]>([])
  const [quantities, setQuantities] = useState({})
  const [statuses, setStatuses] = useState({})
  const [noNotis, setNoNotis] = useState(false)
  const [metadata, setMetadata] = useState<MetadataField[]>([
    { key: "", value: "" },
  ])

  const items =
    "items" in orderToFulfill
      ? orderToFulfill.items
      : orderToFulfill.additional_items
  console.log(items)
  const createOrderFulfillment = useAdminCreateFulfillment(orderId)
  const createSwapFulfillment = useAdminFulfillSwap(orderId)
  const createClaimFulfillment = useAdminFulfillClaim(orderId)

  const isSubmitting =
    createOrderFulfillment.isLoading ||
    createSwapFulfillment.isLoading ||
    createClaimFulfillment.isLoading

  const notification = useNotification()
  console.log(orderToFulfill)
  const createFulfillment = async () => {
    
    const [type] = orderToFulfill.id.split("_")
    type actionType =
    | typeof createOrderFulfillment
    | typeof createSwapFulfillment
    | typeof createClaimFulfillment
    
    let action: actionType = createOrderFulfillment
    let successText = "Successfully fulfilled order"
    let requestObj
    const preparedMetadata = metadata.reduce((acc, next) => {
      if (next.key) {
        return {
          ...acc,
          [next.key]: next.value,
        }
      } else {
        return acc
      }
    }, {})

    switch (type) {
      case "swap":
        action = createSwapFulfillment
        successText = "Successfully fulfilled swap"
        requestObj = {
          swap_id: orderToFulfill.id,
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderSwapsSwapFulfillmentsReq
        break

      case "claim":
        action = createClaimFulfillment
        successText = "Successfully fulfilled claim"
        requestObj = {
          claim_id: orderToFulfill.id,
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderClaimsClaimFulfillmentsReq
        break

      default:
        requestObj = {
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderFulfillmentsReq
        requestObj.items = toFulfill
        requestObj.items = toFulfill
          .filter((itemId) => statuses[itemId] === "Can Ship")
          .map((itemId) => ({ item_id: itemId, quantity: quantities[itemId] }));
        break
    }
    toFulfill.map(async (item) => {
      await Medusa.draftOrders.updateItem(item, { metadata : { "status" : statuses[item]}})
    })
    const uniqueStatuses = new Set(Object.values(statuses));

    let finalStatus;
    if (uniqueStatuses.size > 2) {
      // If there are more than 2 unique statuses, combine them
      finalStatus = [...uniqueStatuses].join(" / ");
    } else if (uniqueStatuses.size === 2) {
      // If there are 2 unique statuses, set it to "Partially (status)"
      
      finalStatus = `Partially (${[...uniqueStatuses].join(" / ")})`;
    } else {
      // If there is only one unique status, use that as the final status
      finalStatus = [...uniqueStatuses][0];
    }

    // Update the order status with the final status
    await Medusa.orders.updateItem(orderId, { metadata: { "status": finalStatus } });
    await Medusa.sendProduction.statusEmail({
      email : orderToFulfill?.email,
      description: `Currenctly Your Order is in ${finalStatus}`,
      title: finalStatus
    })
    notification("Success", `Order Status set to ${finalStatus}`, "success")
 
    if (requestObj.items.length !== 0) {
      action.mutate(requestObj, {
        onSuccess: () => {
          notification("Success", successText, "success")
          handleCancel()
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      })
    }
  }
  useEffect(() => {
    // Set the default status based on items.metadata.status
    const defaultStatuses = {};
    items.forEach((item) => {
      if (item.metadata && item.metadata.status) {
        defaultStatuses[item.id] = item.metadata.status;
      } else {
        defaultStatuses[item.id] = ""; // Set empty string if metadata.status does not exist
      }
    });
    setStatuses(defaultStatuses);
  }, [items]);
  return (
    <Modal handleClose={handleCancel}>
      <Modal.Body>
        <Modal.Header handleClose={handleCancel}>
          <span className="inter-xlarge-semibold">Update Status</span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-base-semibold mb-2">Items</span>
            <CreateFulfillmentItemsTable
              setStatuses={setStatuses}
              statuses={statuses}
              items={items}
              toFulfill={toFulfill}
              setToFulfill={setToFulfill}
              quantities={quantities}
              setQuantities={setQuantities}
            />
            {/* <div className="mt-4">
              <Metadata metadata={metadata} setMetadata={setMetadata} />
            </div> */}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-between">
            <div
              className="items-center h-full flex cursor-pointer"
              onClick={() => setNoNotis(!noNotis)}
            >
              {/* <div
                className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                  !noNotis && "bg-violet-60"
                }`}
              >
                <span className="self-center">
                  {!noNotis && <CheckIcon size={16} />}
                </span>
              </div>
              <input
                id="noNotification"
                className="hidden"
                name="noNotification"
                checked={!noNotis}
                type="checkbox"
              />
              <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                Send notifications
                <IconTooltip content="" />
              </span> */}
            </div>
            <div className="flex">
              <Button
                variant="ghost"
                className="mr-2 w-32 text-small justify-center"
                size="large"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="w-32 text-small justify-center"
                variant="primary"
                disabled={!toFulfill?.length || isSubmitting}
                onClick={createFulfillment}
                loading={isSubmitting}
              >
                Update
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CreateFulfillmentModal
