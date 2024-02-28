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
import NewGraphicMain from "../new/new-graphic-main"
import NewGraphics from "../new/new-graphic"

const VIEWS = ["Graphics / Logos", "Graphic Pricing"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Graphics / Logos")
 
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

  const [offs, setOffs] = useState(0)
  useEffect(() => {
    if (location.search.includes("?view=pricing")) {
      setView("Graphic Pricing")
    }
    location.search = ""
    setOffs(0)
    setisGraphicFetch(false)
    setisGraphicMainFetch(false)
  }, [view, location])



  const [isLoadingGraphics, setisLoadingGraphics] = useState(true);
  const [graphicsList, setGraphics] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isGraphicFetch, setisGraphicFetch] = useState(false);
  const [count, setCount] = useState(1)
 

  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_PAGE_SIZE = 15;
  // const offs = parseInt(searchParams.get('offset')) || 0;
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
  let pageNumber = Math.floor(offs / limit) + 1;
  
  const handlePrev = () => {
    setOffs((prevOffs) => Math.max(0, prevOffs - limit));
  };

  const handleNext = () => {
    setOffs((prevOffs) => prevOffs + limit);
  };


  const fetchGraphics = async (limit, page_number, search="") => {
    try {
      let data;
      if (search !== "") {
        if (search.includes("=")) {
        data = await Medusa.graphics.list(
          limit,
          page_number,
          search
        );
      } else {
        data = await Medusa.graphics.list(
          limit,
          page_number,
          `name=${search}`
        );
        
      }
      } else {
         data = await Medusa.graphics.list(
          limit,
          page_number
        );
      }
      const li = data.data.graphics.graphics.map(
        (item) => item
      );
      setGraphics(li);
      const total = Math.ceil(
        data.data.graphics.totalCount /
          data.data.graphics.pageSize
      );
      setTotalPages(total);
      setCount(data.data.graphics.totalCount)
      setisLoadingGraphics(false);
      setisGraphicFetch(true)
    } catch (error) {
      setisLoadingGraphics(false);
      setisGraphicFetch(true)
    }
  };
  


  const [isLoadingCustomStyle, setisLoadingCustomStyle] = useState(true);
  const [graphicMainList, setGraphicMain] = useState([]);
  const [totalStylePages, setTotalStylePages] = useState(0);
  const [isGraphicMainFetch, setisGraphicMainFetch] = useState(false);
  const [graphicCount, setGraphicCount] = useState(1)


  const fetchGraphicMain = async (limit, page_number, search="") => {
    try {
      let data;
      if (search !== "") {
      if (search.includes("=")) {
        data = await Medusa.graphicsMain.list(
          limit,
          page_number,
          search
        );
      } else {
        data = await Medusa.graphicsMain.list(
          limit,
          page_number,
          `title=${search}`
        );
      }
    } else {
        data = await Medusa.graphicsMain.list(
          limit,
          page_number
        );

      }
      const li = data.data.graphic_main.graphic_main.map(
        (item) => item
      );
      setGraphicMain(li);
      const total = Math.ceil(
        data.data.graphic_main.totalCount /
          data.data.graphic_main.pageSize
      );
      setTotalStylePages(total);
      setGraphicCount(data.data.graphic_main.totalCount)
      setisLoadingCustomStyle(false);
      setisGraphicMainFetch(true)
    } catch (error) {
      console.log(error)
      setisLoadingCustomStyle(false);
      setisGraphicMainFetch(true)
    }
  };

  const [query, setQuery] = useState("");
  useEffect(() => {
    if (view === "Graphics / Logos") {

      fetchGraphics(limit, pageNumber, query);
    }
    if (view === "Graphic Pricing") {

      fetchGraphicMain(limit, pageNumber, query);
    }
  }, [query, offs]);

  const CurrentView = () => {
    useEffect(() => {
      if (view === "Graphics / Logos" && !isGraphicFetch) {

        fetchGraphics(limit, pageNumber);
      }
      if (view === "Graphic Pricing" && !isGraphicMainFetch) {

        fetchGraphicMain(limit, pageNumber);
      }
    }, [view]);
    
    switch (view) {
      case "Graphics / Logos":
        return (
            <CustomTable
              isLoading={isLoadingGraphics}
              itemList={graphicsList}
              totalPages={totalPages}
              offs={offs}
              limit={limit}
              handleNext={handleNext}
              handlePrev={handlePrev}
              query={query}
              setQuery={setQuery}
              count={count}
              path_name="/a/graphics/graphic/"
              deleteData={Medusa.graphics.delete}
              filterTitle="Type"
              filterList={["Graphic", "Sport", "Flag", "Logo", "Festive", "Patriotic"]}
              setItemList={setGraphics}
              header={[
                { Header: "", accessor: "image_url" },
                { Header: "Title", accessor: "name" },
                { Header: "Type", accessor: "type" },
              ]}
            />

            );
            case "Graphic Pricing":
              return (
                <CustomTable
                isLoading={isLoadingCustomStyle}
                itemList={graphicMainList}
                totalPages={totalStylePages}
                offs={offs}
                limit={limit}
                handleNext={handleNext}
                filterTitle="Type"
                filterList={["Graphic", "Sport", "Flag", "Logo", "Festive", "Patriotic"]}
                handlePrev={handlePrev}
                query={query}
                setQuery={setQuery}
                count={graphicCount}
                path_name="/a/graphics/pricing/"
                deleteData={Medusa.graphicsMain.delete}
                setItemList={setGraphicMain}
                header={[
                  { Header: "Title", accessor: "name" },
                ]}
          />
        );
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
      case "Graphics / Logos":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openStyleCreate}
            >
              <PlusIcon size={20} />
              New Graphics
            </Button>
          </div>
        )
      case "Graphic Pricing":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openSizingCreate}
            >
              <PlusIcon size={20} />
              New Graphic Pricing
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
        <NewGraphicMain onClose={closeSizingCreate} />
      </Fade>
      <Fade isVisible={createStyleState} isFullScreen={true}>
        <NewGraphics onClose={closeStyleCreate} />
      </Fade>
    </>
  )
}

export default Overview
