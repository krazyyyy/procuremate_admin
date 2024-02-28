import React from "react"

import TableViewHeader from "../../components/organisms/custom-table-header"
import { useNavigate } from "react-router-dom"

type P = {
  activeView: "Customers" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate()
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={["Customers"]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
