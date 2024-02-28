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
import NewSizeGuide from "../new/new-size-guide"

const VIEWS = ["Size Guides"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Size Guides")
 
  const {
    state: createSizingState,
    close: closeSizingCreate,
    open: openSizingCreate,
  } = useToggleState()
 
  const [offs, setOffs] = useState(0)
  useEffect(() => {
    setOffs(0)
    setisSizeGuideFetch(false)
  }, [view, location])

  

  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_PAGE_SIZE = 15;
  // const offs = parseInt(searchParams.get('offset')) || 0;
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
  let pageNumber = Math.floor(offs / limit) + 1;
  



  const [isLoadingSizeGuide, setisLoadingSizeGuide] = useState(true);
  const [sizeGuideMainList, setSizeGuide] = useState([]);
  const [totalStylePages, setTotalStylePages] = useState(0);
  const [isSizeGuideFetch, setisSizeGuideFetch] = useState(false);
  const [graphicCount, setGraphicCount] = useState(1)


  const fetchSizeGuide = async (limit, page_number, search="") => {
    try {
      let data;
      if (search !== "") {
        data = await Medusa.sizeGuide.list(
          limit,
          page_number,
          `type=${search}`
        );
      } else {
        data = await Medusa.sizeGuide.list(
          limit,
          page_number
        );
      }
      const li = data.data.size_guide.size_guide.map(
        (item) => item
      );
      setSizeGuide(li);
      const total = Math.round(
        data.data.size_guide.totalCount /
          data.data.size_guide.pageSize
      );
      setTotalStylePages(total);
      setGraphicCount(data.data.size_guide.totalCount)
      setisLoadingSizeGuide(false);
      setisSizeGuideFetch(true)
    } catch (error) {
      console.log(error)
      setisLoadingSizeGuide(false);
      setisSizeGuideFetch(true)
    }
  };

  const [query, setQuery] = useState("");
  useEffect(() => {
    if (view === "Size Guides") {
      fetchSizeGuide(limit, pageNumber, query);
    }

  }, [query, offs]);


  const CurrentView = () => {
    useEffect(() => {
      if (view === "Size Guides" && !isSizeGuideFetch) {

        fetchSizeGuide(limit, pageNumber);
      }
    }, [view]);

    const handlePrev = () => {
      setOffs((prevOffs) => Math.max(0, prevOffs - limit));
    };
  
    const handleNext = () => {
      setOffs((prevOffs) => prevOffs + limit);
    };
  
    const [query, setQuery] = useState("");
    console.log(sizeGuideMainList)
    switch (view) {
            case "Size Guides":
              return (
              <CustomTable
                query={query}
                setQuery={setQuery}
                isLoading={isLoadingSizeGuide}
                itemList={sizeGuideMainList}
                totalPages={totalStylePages}
                offs={offs}
                limit={limit}
                handleNext={handleNext}
                handlePrev={handlePrev}
                count={graphicCount}
                path_name="/a/size-guide/"
                deleteData={Medusa.sizeGuide.delete}
                filterTitle="Type"
                filterList={["Men", "Women"]}
                setItemList={sizeGuideMainList}
                header={[
                  { Header: "Type", accessor: "type" },
                  { Header: "Category", accessor: "category_id" },
                ]}
          />
        );
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
      case "Size Guides":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openSizingCreate}
            >
              <PlusIcon size={20} />
              New Size Guide
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
        <NewSizeGuide onClose={closeSizingCreate} />
      </Fade>

    </>
  )
}

export default Overview
