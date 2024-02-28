import { isEmpty } from "lodash";
import qs from "qs";
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { usePagination, useTable } from "react-table";
import Table from "../molecules/table";
import TableContainer from "../organisms/table-container";
import { useProductFilters } from "./product-table/use-product-filters";
import useProductActions  from "./product-table/use-product-actions";
import Medusa from "../../services/api";
import CustomAction from "./custom-actions";
import { ActionType } from "../molecules/actionables"
import EditIcon from "../fundamentals/icons/edit-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import useImperativeDialog from "../../hooks/use-imperative-dialog";
import { useFilters } from "../../domain/custom-products/components/custom-filter/use-filter";
import { FilteringOptionProps } from "../molecules/table/filtering-option";
import CustomFilter from "../../domain/custom-products/components/custom-filter";
const DEFAULT_PAGE_SIZE = 15;

const defaultQueryProps = {
  fields: "id,title,thumbnail,status,handle,collection_id",
  expand:
    "variants,options,variants.prices,variants.options,collection,tags,type,images",
  is_giftcard: false,
};

const CustomTable = ({
  isLoading,
  itemList,
  totalPages,
  offs,
  limit,
  handleNext,
  handlePrev,
  count,
  path_name,
  setItemList,
  deleteData,
  setQuery,
  query='',
  header = [
    { Header: "Id", accessor: "id" },
    { Header: "Title", accessor: "title" },
  ],
  filterList=[],
  filterTitle=''
}) => {
  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    setLimit,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useFilters(location.search, defaultQueryProps)
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (typeof totalPages !== "undefined") {
      setNumPages(totalPages);
    }
  }, [totalPages]);


  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState(path_name, "", `?${stringified}`);
  };



  const columns = React.useMemo(
    () => header,
    []
  );

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
    filter,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: itemList,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
      },
      pageCount: numPages,
    },
    usePagination
  );
  

  const clearFilters = () => {
    reset()
    setQuery("")
  }
  

  return (
    <TableContainer
    numberOfRows={DEFAULT_PAGE_SIZE}
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
    isLoading={isLoading}
    >
    

      <Table 
        enableSearch
        filteringOptions={filterTitle !== "" && (
          <CustomFilter
            filters={filters}
            submitFilters={setFilters}
            clearFilters={clearFilters}
            tabs={filterTabs}
            setQuery={setQuery}
            onTabClick={setTab}
            listFilters={filterList}
            FilterTitle={filterTitle}
            activeTab={activeFilterTab}
            onRemoveTab={removeTab}
            onSaveTab={saveTab}
          />
        )}


          immediateSearchFocus={true}
          searchValue={query}
          handleSearch={setQuery}

          >
      <Table.Head>
              {headerGroups?.map((headerGroup) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col) => (
                    <Table.HeadCell
                      className="min-w-[100px]"
                      {...col.getHeaderProps()}
                    >
                      {col.render("Header")}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              ))}
        </Table.Head>
        <Table.Body>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <ProductRow
                deleteData={deleteData}
                key={i}
                row={row}
                path_name={path_name}
                itemList={itemList}
                setItemList={setItemList}
              />
            );
          })}
        </Table.Body>
      </Table>
      
    </TableContainer>
  );
};

import { useNavigate } from "react-router-dom"
const ProductRow = ({ key, row, path_name, deleteData, itemList, setItemList }) => {
    const product = row.original;
    const navigate = useNavigate()
    const handleDelete = async () => {
      const shouldDelete = await dialog({
        heading: "Delete Item",
        text: "Are you sure you want to delete this?",
      });
      if (shouldDelete) {
        await deleteData(product.id);
    
        // Filter out the deleted row from the itemList
        const updatedItemList = itemList.filter((item) => item.id !== product.id);
    
        // Update the itemList state with the updated array
        setItemList(updatedItemList);
      }
    };

    const dialog = useImperativeDialog()
 
    const getActions = (): ActionType[] => [
        {
          label: "Edit",
          onClick: () => {
            if (path_name.includes("gallery")) {
              navigate(`${path_name}${product.handle.split("/")[product.handle.split("/").length - 1]}`);
            } else {
              navigate(`${path_name}${product.id}`);
            }
          },
          icon: <EditIcon size={20} />,
        },
        {
            label: "Delete",
            variant: "danger",
            onClick: handleDelete,
            icon: <TrashIcon size={20} />,
        },
    ]

    return (
<Table.Row
  key={key}
  color={"inherit"}
  linkTo={path_name.includes("gallery") ? `${path_name}${product.handle.split("/")[product.handle.split("/").length - 1]}` : `${path_name}${product.id}`}
  actions={getActions()}
  // {...rest}
>
{row.cells.map((cell, index) => {
  console.log(cell.value)
  if (cell.column.id === "image_url" || cell.column.id === "hex_color") {
    return (
      <Table.Cell {...cell.getCellProps()}>
        {cell.value !== undefined && cell.value !== null ? (
          <div className="">
            {cell.column.id === "hex_color" ? (
              <>
                {row?.original?.image_url && row?.original?.image_url !== "" && (
                  <>
                  {cell.value !== "" && 
                    <div className="h-8 w-8 mr-2" style={{ backgroundColor: cell.value }}></div>
          
                  }
                    <div className="h-8 w-8 my-1.5 flex items-center mr-4">
                      <img
                        src={row.original.image_url}
                        className="h-full object-cover rounded-soft"
                        alt="Image"
                      />
                    </div>
                  </>
                )}
                {!row?.original?.image_url && (
                  <div className="h-8 w-8 mr-2" style={{ backgroundColor: cell.value }}></div>
                )}
              </>
            ) : (
              <>
                {row?.original?.hex_color && row?.original?.hex_color !== "" && (
                  <div>
                    <div
                      className="h-8 w-8 mr-2"
                      style={{ backgroundColor: row.original.hex_color }}
                    ></div>
                    {cell.value !== "" &&
                    <div className="h-8 w-8 my-1.5 flex items-center mr-4">
                      <img
                        src={cell.value}
                        className="h-full object-cover rounded-soft"
                        alt="Image"
                      />
                    </div>
    }
                  </div>
                )}
                {!row?.original?.hex_color && (
                  <div className="h-8 w-8 my-1.5 flex items-center mr-4">
                    <img
                      src={cell.value}
                      className="h-full object-cover rounded-soft"
                      alt="Image"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </Table.Cell>
    );
  }
   else {
    return (
      <Table.Cell {...cell.getCellProps()}>
        {cell.value !== undefined && cell.value !== null ? (
          Array.isArray(cell.value) ? (
            cell.value.map((item) => (item.name || item.title)).join(", ")
          ) : typeof cell.value === "object" ? (
            cell.value.name || cell.value.title
          ) : (
            cell.render("Cell", { index })
          )
        ) : null}
      </Table.Cell>
    );
  }
})}

</Table.Row>

    );
  };

export default CustomTable;
