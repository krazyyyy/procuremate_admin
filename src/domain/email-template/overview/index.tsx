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
import NewEmail from "../new/emails"

const VIEWS = ["Emails"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Emails")
 
  const {
    state: createSizingState,
    close: closeSizingCreate,
    open: openSizingCreate,
  } = useToggleState()
 

  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_PAGE_SIZE = 15;
  const offs = parseInt(searchParams.get('offset')) || 0;
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
  let pageNumber = Math.floor(offs / limit) + 1;
  

  const handleNext = () => {
    pageNumber += 1
    // fetchGraphics(limit, pageNumber)
    // Add your logic to handle the next page action here
  };
  
  // Define the handlePrev function to handle the previous page action
  const handlePrev = () => {
    pageNumber -= 1
    // fetchGraphics(limit, pageNumber)
    // Add your logic to handle the previous page action here
  };


  const [isLoadingEmail, setisLoadingEmail] = useState(true);
  const [emailList, setEmail] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isGalleryFetch, isEmailFetch] = useState(false);
  const [emailCount, setemailCount] = useState(1)


  const fetchEmails = async (limit, page_number) => {
    try {
      const data = await Medusa.emailTemplate.list(
        limit,
        page_number
      );
      const li = data.data.email_templates.email_template.map(
        (item) => item
      );
      setEmail(li);
      const total = Math.round(
        data.data.email_templates.totalCount /
          data.data.email_templates.pageSize
      );
      setTotalPages(total);
      setemailCount(data.data.email_templates.totalCount)
      setisLoadingEmail(false);
      isEmailFetch(true)
    } catch (error) {
      console.log(error)
      setisLoadingEmail(false);
      isEmailFetch(true)
    }
  };


  const CurrentView = () => {
    useEffect(() => {
      if (view === "Emails" && !isGalleryFetch) {

        fetchEmails(limit, pageNumber);
      }
    }, [view]);
    const [query, setQuery] = useState('')
    switch (view) {

            case "Emails":
              return (
                <CustomTable
                isLoading={isLoadingEmail}
                itemList={emailList}
                setQuery={setQuery}
                query={query}
                totalPages={totalPages}
                offs={offs}
                limit={limit}
                handleNext={handleNext}
                handlePrev={handlePrev}
                count={emailCount}
                path_name="/a/email-template/"
                deleteData={Medusa.emailTemplate.delete}
                setItemList={setEmail}
                header={[
                  { Header: "Title", accessor: "name" },
                  { Header: "Type", accessor: "type" },
                ]}
          />
        );
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
      case "Emails":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openSizingCreate}
            >
              <PlusIcon size={20} />
              New Email Template
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
        <NewEmail onClose={closeSizingCreate} />
      </Fade>

    </>
  )
}

export default Overview
