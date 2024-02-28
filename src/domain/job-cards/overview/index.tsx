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
import JobCard from "../components/job-card"
const VIEWS = ["Job Cards"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Job Cards")
 
  const {
    state: createSizingState,
    close: closeSizingCreate,
    open: openSizingCreate,
  } = useToggleState()
 

  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_PAGE_SIZE = 15;
  // const offs = parseInt(searchParams.get('offset')) || 0;
  const [offs, setOffs] = useState(parseInt(searchParams.get('offset')) || 0)
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE
  let pageNumber = Math.floor(offs / limit) + 1;
  

  const [isLoadingJobCard, setisLoadingJobCard] = useState(true);
  const [jobList, setJobCards] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isJobCardFetch, setisJobCardFetch] = useState(false);
  const [count, setJobCardsCount] = useState(1)

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [shipingFilter, setShippingFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const fetchJobCards = async (limit, page_number, search = "") => {
    try {
      let queryParams = {};
  
      if (search !== "") {
        const emailRegex = /^\S+@\S+\.\S+$/;
        const isEmail = emailRegex.test(search);
        const isInteger = /^\d+$/.test(search);
  
        if (isEmail || isInteger) {
          let data_type = isEmail ? "email" : "display_id";
          queryParams[data_type] = search;
        } else {
          // Handle the case when search is neither an integer nor an email
          // You can return an error or handle it based on your requirements
          return "Invalid search parameter";
        }
      }
  
      if (statusFilter !== "") {
        queryParams.order_status = statusFilter;
      }
  
      if (shipingFilter !== "") {
        queryParams.type = shipingFilter;
      }
  
      if (dateFilter !== "") {
        queryParams.date_key = dateFilter === "DueDate" ? "due_date" : "send_date";
      }
  
      let queryString = "";
      for (const key in queryParams) {
        if (queryString !== "") {
          queryString += "&";
        }
        queryString += `${key}=${queryParams[key]}`;
      }
  
      const url = `${queryString}`;
  
      const data = await Medusa.jobCards.list(limit, page_number, url);
  
      const li = data.data.jobCards.job_cards.map((item) => item);
      setJobCards(li);
      const total = Math.ceil(
        data.data.jobCards.totalCount / data.data.jobCards.pageSize
      );
      setTotalPages(total);
      setJobCardsCount(data.data.jobCards.totalCount);
      setisLoadingJobCard(false);
      setisJobCardFetch(true);
    } catch (error) {
      console.log(error);
      setisLoadingJobCard(false);
      setisJobCardFetch(true);
    }
  };
  


  const handlePrev = () => {
    setOffs((prevOffs) => Math.max(0, prevOffs - limit));
  };

  const handleNext = () => {
    setOffs((prevOffs) => prevOffs + limit);
  };


  useEffect(() => {
    if (view === "Job Cards") {

      fetchJobCards(limit, pageNumber, query);
    }
  }, [query, offs, statusFilter, shipingFilter, dateFilter]);
  const CurrentView = () => {
    useEffect(() => {
      if (view === "Job Cards" && !isJobCardFetch) {

        fetchJobCards(limit, pageNumber, query);
      }
    }, [view]);
    
    switch (view) {

            case "Job Cards":
              return (  
                <JobCard isLoading={isLoadingJobCard} query={query} setQuery={setQuery} totalPages={totalPages} offs={offs} limit={limit} handleNext={handleNext} handlePrev={handlePrev} count={count} jobList={jobList} setCategoryFilter={setCategoryFilter} categoryFilter={categoryFilter} setDateFilter={setDateFilter} dateFilter={dateFilter} setShippingFilter={setShippingFilter} shippingFilter={shipingFilter} setStatusFilter={setStatusFilter} statusFilter={statusFilter}/>
        );
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
      case "Job Casrds":
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
        <NewSizeGuide onClose={closeSizingCreate} />
      </Fade>

    </>
  )
}

export default Overview
