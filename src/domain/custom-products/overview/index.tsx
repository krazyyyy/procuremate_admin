import { useAdminCreateBatchJob, useAdminCreateCollection } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Fade from "../../../components/atoms/fade-wrapper"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import ExportModal from "../../../components/organisms/export-modal"
import AddCollectionModal from "../../../components/templates/collection-modal"
import ProductTable from "../../../components/templates/custom-product-table"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import ImportProducts from "../batch-job/import"
import NewProduct from "../new"
import { PollingContext } from "../../../context/polling"
import CustomTable from "../../../components/templates/custom-table"
import Medusa from "../../../services/api"
import NewSizes from "../new/new-size"
import NewStyles from "../new/new-style"
import LoadingSkeleton from "../loading"
const VIEWS = ["Custom Products", "Custom Sizing", "Custom Style"]

const Overview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState("Custom Products")
  const {
    state: createProductState,
    close: closeProductCreate,
    open: openProductCreate,
  } = useToggleState()

  const {
    state: createSizingState,
    close: closeSizingCreate,
    open: openSizingCreate,
  } = useToggleState()

  const {
    state: createStyleState,
    close: closeStyleCreate,
    open: openStyleCreate,
  } = useToggleState()

  const { resetInterval } = useContext(PollingContext)
  const createBatchJob = useAdminCreateBatchJob()

  const notification = useNotification()

  const createCollection = useAdminCreateCollection()
  const searchParams = new URLSearchParams(location.search)
  const [offs, setOffs] = useState(parseInt(searchParams.get("offset")) || 0)
  useEffect(() => {
    if (location.search.includes("?view=custom-sizing")) {
      setView("Custom Sizing")
    }
    if (location.search.includes("?view=custom-style")) {
      setView("Custom Style")
    }
    location.search = ""
    setOffs(0)
    setisSizingFetch(false)
    setisStyleFetch(false)
  }, [view, location])

  // useEffect(() => {
  //   location.search = ""
  // }, [view])
  //  Fetching Collection!
  const [collectionId, setCollectionId] = useState([])
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)

  useEffect(() => {
    const fetchCollection = async () => {
      const li = []
      try {
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            resolve(true)
          }, 2000)
        )
        const { data } = await Medusa.collections.list({
          title: "Custom Fightwear",
        })
        const { collections } = data
        if (collections.length !== 0) {
          li.push(collections[0].id)
        }
        const coll_1 = await Medusa.collections.list({
          title: "Custom Equipment",
        })

        if (coll_1.data.collections.length !== 0) {
          li.push(coll_1.data.collections[0].id)
        }
        const coll_2 = await Medusa.collections.list({ title: "Club Kits" })

        if (coll_2.data.collections.length !== 0) {
          li.push(coll_2.data.collections[0].id)
        }
      } catch (error) {
        // Handle error if collection fetch fails
      } finally {
        setIsLoadingCollection(false)
      }
      setCollectionId(li)
    }

    fetchCollection()
  }, [])

  const [isLoadingCustomSizing, setisLoadingCustomSizing] = useState(true)
  const [sizingList, setSizing] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [isSizingFetch, setisSizingFetch] = useState(false)
  const [count, setCount] = useState(1)

  const DEFAULT_PAGE_SIZE = 15
  // const offs = parseInt(searchParams.get('offset')) || 0;
  const limit = parseInt(searchParams.get("limit")) || DEFAULT_PAGE_SIZE
  const pageNumber = Math.floor(offs / limit) + 1

  const fetchSizes = async (limit, page_number, search = "") => {
    try {
      let data
      if (search !== "") {
        data = await Medusa.customSizing.list(
          limit,
          page_number,
          `title=${search}`
        )
      } else {
        data = await Medusa.customSizing.list(limit, page_number)
      }
      const li = data.data.custom_product_sizings.custom_product_sizings.map(
        (item) => item
      )
      setSizing(li)
      const total = Math.ceil(
        data.data.custom_product_sizings.totalCount /
        data.data.custom_product_sizings.pageSize
      )
      setTotalPages(total)
      setCount(data.data.custom_product_sizings.totalCount)
      setisLoadingCustomSizing(false)
      setisSizingFetch(true)
    } catch (error) {
      setisLoadingCustomSizing(false)
      setisSizingFetch(true)
    }
  }

  const [isLoadingCustomStyle, setisLoadingCustomStyle] = useState(true)
  const [styleList, setStyle] = useState([])
  const [totalStylePages, setTotalStylePages] = useState(0)
  const [isStyleFetch, setisStyleFetch] = useState(false)
  const [countStyle, setCountStyle] = useState(1)

  const fetchStyles = async (limit, page_number, search = "") => {
    try {
      let data
      if (search !== "") {
        data = await Medusa.customProductStyle.list(
          limit,
          page_number,
          `title=${search}`
        )
      } else {
        data = await Medusa.customProductStyle.list(limit, page_number)
      }
      const li = data.data.custom_style.custom_style.map((item) => item)
      setStyle(li)
      const total = Math.ceil(
        data.data.custom_style.totalCount / data.data.custom_style.pageSize
      )
      setTotalStylePages(total)
      setCountStyle(data.data.custom_style.totalCount)
      setisLoadingCustomStyle(false)
      setisStyleFetch(true)
    } catch (error) {
      setisLoadingCustomStyle(false)
      setisStyleFetch(true)
    }
  }

  const handlePrev = () => {
    setOffs((prevOffs) => Math.max(0, prevOffs - limit))
  }

  const handleNext = () => {
    setOffs((prevOffs) => prevOffs + limit)
  }

  const [query, setQuery] = useState("")
  useEffect(() => {
    if (view === "Custom Sizing") {
      fetchSizes(limit, pageNumber, query)
    }
    if (view === "Custom Style") {
      fetchStyles(limit, pageNumber, query)
    }
  }, [query, offs])

  const CurrentView = () => {
    useEffect(() => {
      if (view === "Custom Sizing" && !isSizingFetch) {
        fetchSizes(limit, pageNumber)
        setQuery("")
      }
      if (view === "Custom Style" && !isStyleFetch) {
        fetchStyles(limit, pageNumber)
        setQuery("")
      }
    }, [view])

    if (isLoadingCollection) {
      return <LoadingSkeleton />
    }

    switch (view) {
      case "Custom Products":
        setisSizingFetch(false)
        return (
          <ProductTable
            collectionId={collectionId}
            isLoadingCollection={isLoadingCollection}
          />
        )
      case "Custom Sizing":
        return (
          <CustomTable
            isLoading={isLoadingCustomSizing}
            itemList={sizingList}
            totalPages={totalPages}
            offs={offs}
            limit={limit}
            handleNext={handleNext}
            handlePrev={handlePrev}
            count={count}
            query={query}
            setQuery={setQuery}
            path_name="/a/custom-products/sizing/"
            deleteData={Medusa.customSizing.delete}
            setItemList={setSizing}
            header={[
              { Header: "Title", accessor: "title" },
              { Header: "Category", accessor: "productCategories" },
            ]}
          />
        )
      case "Custom Style":
        return (
          <CustomTable
            isLoading={isLoadingCustomStyle}
            itemList={styleList}
            totalPages={totalStylePages}
            offs={offs}
            limit={limit}
            handleNext={handleNext}
            handlePrev={handlePrev}
            count={countStyle}
            query={query}
            setQuery={setQuery}
            path_name="/a/custom-products/style/"
            deleteData={Medusa.customProductStyle.delete}
            setItemList={setStyle}
            header={[
              { Header: "Title", accessor: "title" },
              { Header: "Type", accessor: "type" },
              { Header: "Category", accessor: "productCategories" },
            ]}
          />
        )
      default:
        return <></>
    }
  }

  const CurrentAction = () => {
    switch (view) {
      case "Custom Products":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openProductCreate}
            >
              <PlusIcon size={20} />
              New Product
            </Button>
          </div>
        )
      case "Custom Style":
        return (
          <div className="flex space-x-2">
            <Button variant="secondary" size="small" onClick={openStyleCreate}>
              <PlusIcon size={20} />
              New Item
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex space-x-2">
            <Button variant="secondary" size="small" onClick={openSizingCreate}>
              <PlusIcon size={20} />
              New Item
            </Button>
          </div>
        )
    }
  }

  const [showNewCollection, setShowNewCollection] = useState(false)
  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const {
    open: openImportModal,
    close: closeImportModal,
    state: importModalOpen,
  } = useToggleState(false)

  const handleCreateCollection = async (data, colMetadata) => {
    const metadata = colMetadata
      .filter((m) => m.key && m.value) // remove empty metadata
      .reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})

    await createCollection.mutateAsync(
      { ...data, metadata },
      {
        onSuccess: ({ collection }) => {
          notification("Success", "Successfully created collection", "success")
          navigate(`/a/collections/${collection.id}`)
          setShowNewCollection(false)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  const handleCreateExport = () => {
    const reqObj = {
      type: "product-export",
      context: {},
      dry_run: false,
    }

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        resetInterval()
        notification("Success", "Successfully initiated export", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })

    closeExportModal()
  }

  return (
    <>
      <div className="flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            forceDropdown={false}
            customActionable={CurrentAction()}
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={setView}
                activeView={view}
              />
            }
            className="h-fit"
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>
      {showNewCollection && (
        <AddCollectionModal
          onClose={() => setShowNewCollection(!showNewCollection)}
          onSubmit={handleCreateCollection}
        />
      )}
      {exportModalOpen && (
        <ExportModal
          title="Export Products"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
      {importModalOpen && (
        <ImportProducts handleClose={() => closeImportModal()} />
      )}
      <Fade isVisible={createProductState} isFullScreen={true}>
        <NewProduct onClose={closeProductCreate} />
      </Fade>
      <Fade isVisible={createSizingState} isFullScreen={true}>
        <NewSizes onClose={closeSizingCreate} />
      </Fade>
      <Fade isVisible={createStyleState} isFullScreen={true}>
        <NewStyles onClose={closeStyleCreate} />
      </Fade>
    </>
  )
}

export default Overview
