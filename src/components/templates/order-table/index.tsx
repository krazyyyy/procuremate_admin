import clsx from "clsx"
import { isEmpty } from "lodash"
import { useAdminOrders } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import { useAnalytics } from "../../../context/analytics"
import { FeatureFlagContext } from "../../../context/feature-flag"
import { consolidateImages } from "../../../utils/consolidate-images"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import OrderFilters from "../order-filter-dropdown"
import useOrderTableColums from "./use-order-column"
import { useOrderFilters } from "./use-order-filters"
import Medusa from "../../../services/api"

const DEFAULT_PAGE_SIZE = 15
const defaultQueryProps = {
  
}

type OrderTableProps = {
  setContextFilters: (filters: Record<string, { filter: string[] }>) => void
}

const OrderTable = ({ setContextFilters }: OrderTableProps) => {
  const location = useLocation()

  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)
  const { trackNumberOfOrders } = useAnalytics()

  let hiddenColumns = ["sales_channel"]
  // if (isFeatureEnabled("sales_channels")) {
  //   defaultQueryProps.expand = defaultQueryProps.expand + ",sales_channel"
  //   hiddenColumns = []
  // }

  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useOrderFilters(location.search, defaultQueryProps)
  const filtersOnLoad = queryObject
  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad.limit) || DEFAULT_PAGE_SIZE
  
  const [query, setQuery] = useState(filtersOnLoad?.query)
  const [numPages, setNumPages] = useState(0)
  // const { orders, isLoading, count } = useAdminOrders(queryObject, {
  //   keepPreviousData: true,
  //   onSuccess: ({ count }) => {
  //     trackNumberOfOrders({
  //       count,
  //     })
  //   },
  // })
  const [statusFilter, setStatusFilter] = useState('');
  let pageNumber = Math.floor(offs / lim) + 1;
  
  const { orders: adminOrders, isLoading: adminIsLoading, count: adminCount } = useAdminOrders(
    queryObject,
    {
      keepPreviousData: true,
      onSuccess: ({ count }) => {
        trackNumberOfOrders({
          count,
        });
      },
    }
  );
  
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0);
  
  const getOrder = async () => {
    setIsOrderLoading(true);
  
    try {
      const response = await Medusa.orders.searchOrder(
        lim,
        pageNumber,
        `order_status=${statusFilter}`
      );
      const { orders, count } = response.data.orders;
      console.log(orders)
      console.log(count)
      setFilteredOrders(orders);
      setFilteredCount(count);
  
      setIsOrderLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsOrderLoading(false);
    }
  };
  
  useEffect(() => {
    if (statusFilter) {
      getOrder();
    }
  }, [statusFilter]);
  
  const orders = statusFilter ? filteredOrders : adminOrders;
  const count = statusFilter ? filteredCount : adminCount;
  const isLoadingFinal = statusFilter ? isOrderLoading : adminIsLoading;
  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [orders])
  
  useEffect(() => {
    setContextFilters(filters as {})
  }, [filters])

  const [columns] = useOrderTableColums()
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: orders || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
        hiddenColumns,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        // if we delete query string, we reset the table view
        reset()
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/orders`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = representationObject

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  useEffect(() => {
    refreshWithFilters()
  }, [representationObject])
   const FilterComp = () => {
    return (
      <div className="flex">
        <div className="mr-2">
          <select className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                          onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All orders</option>
          <option value="Cart">Cart</option>
          <option value="Checkout">Checkout</option>
          <option value="Pending">Pending</option>
          <option value="Job Card Issued">Job Card Issued</option>
          <option value="Can Cut Out">Can Cut Out</option>
          <option value="Already Cut Out">Already Cut Out</option>
          <option value="In Production">In Production</option>
          <option value="Design Sent">Design Sent</option>
          <option value="Production Picture Sent">Production Picture Sent</option>
          <option value="Can Finish">Can Finish</option>
          <option value="Finished">Finished</option>
          <option value="Final Check">Final Check</option>
          <option value="Can Ship">Can Ship</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Refunded">Refunded</option>
          <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        </div>
        )
    }

  return (
    <div>
      <TableContainer
        isLoading={isLoadingFinal}
        hasPagination
        numberOfRows={lim}
        pagingState={{
          count: count!,
          offset: queryObject.offset,
          pageSize: queryObject.offset + rows.length,
          title: "Orders",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
      >
        <Table
          filteringOptions={
            <FilterComp />
          }
          enableSearch
          handleSearch={setQuery}
          searchValue={query}
          {...getTableProps()}
          className={clsx({ ["relative"]: isLoadingFinal })}
        >
          <Table.Head>
            {headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                  className="group"
                >
                  {row.cells.map((cell) => {
                    if (cell.render("Header") ===  "Customer") {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                          {row.original.email}
                        </Table.Cell>
                      )
                    } else {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </Table.Cell>
                        
                      )
                    }
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </div>
  )
}

export default React.memo(OrderTable)
