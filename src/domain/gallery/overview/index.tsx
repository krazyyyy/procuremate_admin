import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Fade from "../../../components/atoms/fade-wrapper"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import useToggleState from "../../../hooks/use-toggle-state"
import CustomTable from "../../../components/templates/custom-table"
import Medusa from "../../../services/api"
import NewGallery from "../new/gallery"

const VIEWS = ["Gallery"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Gallery")
 
  const {
    state: createSizingState,
    close: closeSizingCreate,
    open: openSizingCreate,
  } = useToggleState()
 

  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_PAGE_SIZE = 15;
  const [offs, setOffs] = useState(0)
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
  let pageNumber = Math.floor(offs / limit) + 1;
  

  // const handleNext = () => {
  //   pageNumber += 1
  //   fetchGallery(limit, pageNumber)
  //   // Add your logic to handle the next page action here
  // };
  
  // // Define the handlePrev function to handle the previous page action
  // const handlePrev = () => {
  //   pageNumber -= 1
  //   fetchGallery(limit, pageNumber)
  //   // Add your logic to handle the previous page action here
  // };
  const handlePrev = () => {
    setOffs((prevOffs) => Math.max(0, prevOffs - limit));
  };

  const handleNext = () => {
    setOffs((prevOffs) => prevOffs + limit);
  };


  const [isLoadingGallery, setisLoadingGallery] = useState(true);
  const [galleryList, setGallery] = useState([]);
  const [totalPages, settotalPages] = useState(0);
  const [isGalleryFetch, setisGalleryFetch] = useState(false);
  const [galleryCount, setgalleryCount] = useState(1)


  const fetchGallery = async (limit, page_number) => {
    try {
      const data = await Medusa.gallery.list(
        limit,
        page_number
      );
      const li = data.data.gallery.gallery.map(
        (item) => item
      );
      setGallery(li);
      const total = Math.ceil(
        data.data.gallery.totalCount /
          data.data.gallery.pageSize
      );
      settotalPages(total);
      setgalleryCount(data.data.gallery.totalCount)
      setisLoadingGallery(false);
      setisGalleryFetch(true)
    } catch (error) {
      console.log(error)
      setisLoadingGallery(false);
      setisGalleryFetch(true)
    }
  };

  useEffect(() => {
    if (view === "Gallery") {

      fetchGallery(limit, pageNumber);
    }

  }, [offs]);


  const CurrentView = () => {
    useEffect(() => {
      if (view === "Gallery" && !isGalleryFetch) {

        fetchGallery(limit, pageNumber);
      }
    }, [view]);
    const [query, setQuery] = useState('')
    switch (view) {

            case "Gallery":
              return (
                <CustomTable
                isLoading={isLoadingGallery}
                itemList={galleryList}
                setQuery={setQuery}
                query={query}
                totalPages={totalPages}
                offs={offs}
                limit={limit}
                handleNext={handleNext}
                handlePrev={handlePrev}
                count={galleryCount}
                path_name="/a/gallery/"
                deleteData={Medusa.gallery.delete}
                setItemList={setGallery}
                header={[
                  { Header: "Title", accessor: "title" }
                ]}
          />
        );
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
      case "Gallery":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openSizingCreate}
            >
              <PlusIcon size={20} />
              New Gallery
            </Button>
          </div>
        )
      default:
        return (
       <></>
        )
    }
  }




  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
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

      <Fade isVisible={createSizingState} isFullScreen={true}>
        <NewGallery onClose={closeSizingCreate} />
      </Fade>

    </>
  )
}

export default Overview
