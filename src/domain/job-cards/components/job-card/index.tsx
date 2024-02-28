import React, { useEffect, useState, useRef } from "react";
import MoreHorizontalIcon from "../../../../components/fundamentals/icons/more-horizontal-icon";
import Button from "../../../../components/fundamentals/button";
import { formatAmountWithSymbol } from "../../../../utils/prices";
import TableContainer from "../../../../components/organisms/table-container";
import { usePagination, useTable } from "react-table";
import { capitalize } from "lodash";
import Table from "../../../../components/molecules/table";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JobCardPrint from "../../edit/job-card-print";
import PrintIcon from "../../../../components/fundamentals/icons/print-icon";
import Spinner from "../../../../components/atoms/spinner";
import { ReactSVG } from 'react-svg'
const JobCard = ({
  isLoading,
  jobList,
  totalPages,
  offs,
  limit,
  handleNext,
  handlePrev,
  count,
  setQuery,
  query='',
  setCategoryFilter,
  setStatusFilter,
  setDateFilter,
  setShippingFilter,
  shippingFilter,
  dateFilter,
  statusFilter,
  categoryFilter,
  header = [
    { Header: "Id", accessor: "id" },
    { Header: "Title", accessor: "title" },
  ],
}) => {
  
  const columns = React.useMemo(() => header, []);
  const [selectedJob, setSelectedJob] = useState(null); // Track the selected job for printing
  const printRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [printing, setPrinting] = useState(false); // State to track if printing is in progress


  useEffect(() => {
    if (typeof totalPages !== "undefined") {
      setNumPages(totalPages);
    }
  }, [totalPages]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: jobList,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
      },
      pageCount: numPages,
    },
    usePagination
  );

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
        <div className="mr-2">
          <select className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                                    onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
          <option value="">By Order Date</option>
          <option value="DueDate">By Due Date</option>
          <option value="sendDate">By Send Date</option>
          </select>
        </div>
        <div className="mr-2">
          <select className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                           value={shippingFilter}  onChange={(e) => setShippingFilter(e.target.value)}>
            <option value="">All</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="super express">Super Express</option>
          </select>
        </div>
        {/* <div className="mr-2">
          <select className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                                  value={categoryFilter}  onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Category">Category</option>
          </select>
        </div> */}
      </div>
    );
  };
  
  const [printable, setPrintable] = useState(false);

  const handlePrint = (job) => {
    setPrinting(true)
    setSelectedJob(job);

  };
  
    

  return (
    <TableContainer
      numberOfRows={1}
      hasPagination
      pagingState={{
        count: count!,
        offset: offs,
        pageSize: offs + rows.length,
        title: "Products",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
        <Table
        enableSearch
        immediateSearchFocus={true}
        searchValue={query}
        handleSearch={setQuery}
        filteringOptions={
          <FilterComp />
        }
        > 
        <div>

        </div>
    <div className="flex justify-between mb-4">

    </div>
      <div className="flex flex-wrap">
        {jobList.map((job) => (
          <div key={job.id}>

            <div className="w-[531px] h-[266px] border border-gray-300 rounded-md p-4 overflow-hidden m-2">
              <div className="flex items-center justify-between">
                <span className="font-montserrat font-bold text-[14px] leading-[18px] text-black">
                  Order #  {job?.order_id?.display_id ?? ""}
                </span>
                <a href={`/a/job-cards/print/${job.id}`}>
                <span className="cursor-pointer" onClick={(event) => {
                    handlePrint(job);
                  }}>
                    <PrintIcon color="none" onClick={() =>    handlePrint(job)} />
                </span>
                </a>
              </div>
              <div className="flex items-center justify-between mt-7">
                <span className="font-montserrat text-[14px] leading-[18px] text-black">
                  {job?.product_id?.title}
                </span>
                <div className="flex gap-2">
                    <button
                      className="w-[80px] h-[20px] bg-[#DF3A23] rounded-[5px] text-white text-[12px] leading-[14px] text-center font-bold overflow-hidden"
                      style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '12px' }}
                    >
                      {capitalize(job?.type) || "Standard"}
                    </button>
                  </div>

              </div>
              <a href={`/a/job-cards/${job.id}`} key={job.id}>
              <div className="flex justify-between mt-2 h-[184px]">
                <div className="flex w-1/2 items-center justify-center">
                              <div className="flex w-1/2 items-center">
                                <img
                                  src={job?.product_id?.thumbnail || ""}
                                  alt="Product"
                                  className="rounded-md w-full h-full object-cover"
                                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                                />
                    {/* {job?.custom_design_id?.design_data?.svg ? (
                    job.custom_design_id.design_data.svg.startsWith('data:image/svg+xml') ? (
                      // <img
                      //   src={job.custom_design_id.design_data.svg}
                      //   alt="SVG Image"
                      //   className="rounded-md w-full h-full object-cover"
                      //   style={{ maxHeight: "100%", maxWidth: "100%" }}
                      // />
                      <ReactSVG src={job.custom_design_id.design_data.svg} />
                    ) : (
                      <svg dangerouslySetInnerHTML={{ __html: job.custom_design_id.design_data.svg }} />
                    )
                  ) : (
                  )} */}
              </div>
              

                </div>
       
                <div className="w-1/2 flex justify-start pt-[20px]">
                  <p>
                    <span className="font-montserrat font-bold text-[12px] leading-[16px] text-center text-black">
                      Created at:
                    </span>
                    <span className="font-montserrat text-[12px] leading-[16px] text-center text-black">
                      {job?.order_id?.created_at ?? ""}
                    </span>
                    <br />
                    <span className="font-montserrat font-bold text-[12px] leading-[16px] text-center text-black">
                      Qty:
                    </span>
                    <span className="font-montserrat text-[12px] leading-[16px] text-center text-black">
                      1
                    </span>
                    <br />
                    <span className="font-montserrat font-bold text-[12px] leading-[16px] text-center text-black">
                      Total:
                    </span>
                    <span className="font-montserrat text-[12px] leading-[16px] text-center text-black">
                      {formatAmountWithSymbol({
                        amount: job?.order_id?.payments[0]?.amount,
                        currency: job?.order_id?.currency_code,
                        digits: 2,
                      }) ?? ""}
                    </span>
                    <br />
                  </p>
                </div>
              </div>
              </a>
            </div>

          </div>
        ))}
      </div>
      </Table>

    </TableContainer>
  );
};

export default JobCard;
