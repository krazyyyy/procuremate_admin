import { capitalize } from "lodash"
import moment from "moment"
import { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { getColor } from "../../../utils/color"
import { isoAlpha2Countries } from "../../../utils/countries"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import StatusDot from "../../fundamentals/status-indicator"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

const useOrderTableColums = () => {
  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return <StatusDot variant="success" title={"Paid"} />
      case "awaiting":
        return <StatusDot variant="default" title={"Awaiting"} />
      case "requires_action":
        return <StatusDot variant="danger" title={"Requires action"} />
      case "canceled":
        return <StatusDot variant="warning" title={"Canceled"} />
      default:
        return <StatusDot variant="primary" title={"N/A"} />
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Order</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: <div className="pl-2">Status</div>,
        accessor: "metadata.status",
        Cell: ({ row, cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`${value ?? capitalize(row?.original?.status)}`}</p>
        ),
      },
      {
        Header: "Dates",
        accessor: "created_at",
        Cell: ({ row, cell: { value } }) => (
          <div>Created : 
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
               {moment(value).format("DD MMM YYYY")}
            </Tooltip>
       { row.original?.metadata?.due_date &&    <div> Due Date : 
              {moment(row.original?.metadata?.due_date).format("DD MMM YYYY")}
            </div>}
            {row.original?.metadata?.send_date && <div> Send Date : 
              {moment(row.original?.metadata?.send_date).format("DD MMM YYYY")}
            </div>}
          </div>
        ),
      },      
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name,
                last_name:
                  value?.last_name || row.original.shipping_address?.last_name,
                email: row.original.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: "Product",
        accessor: "",
        Cell: ({ row }) => (
          <div>
            {row.original.items.map((item) => (
              <div key={item.id}>
                {`${item.quantity} x ${item.title}`}
                <br />
                {formatAmountWithSymbol({
                    amount: item.unit_price,
                    currency: row.original.currency_code,
                    digits: 2,
                  })}
              </div>
            ))}
          </div>
        ),
      },
      
      {
        Header: () => <div className="text-right">Total</div>,
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-right">
            {formatAmountWithSymbol({
              amount: row?.original?.payments[0].amount,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },

      // {
      //   Header: "Product",
      //   accessor: "product",
      //   Cell: ({ row }) => (
      //     <div className="pr-2">
      //       <div className="flex rounded-rounded w-full justify-end">
      //         <Tooltip
      //           content={
      //             isoAlpha2Countries[
      //               row.original.shipping_address?.country_code?.toUpperCase()
      //             ] ||
      //             row.original.shipping_address?.country_code?.toUpperCase()
      //           }
      //         >
      //           <ReactCountryFlag
      //             className={"rounded"}
      //             svg
      //             countryCode={row.original.shipping_address?.country_code}
      //           />
      //         </Tooltip>
      //       </div>
      //     </div>
      //   ),
      // },
    ],
    []
  )

  return [columns]
}

export default useOrderTableColums
