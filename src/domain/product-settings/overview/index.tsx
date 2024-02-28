import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import GraphicForm from "../components/graphic-form" 
import AreasForm from "../components/areas-form"
import ColorGroupForm from "../components/color-group-form"
import NamesForm from "../components/names-form"
import ProductionForm from "../components/production-form"
const VIEWS = ["Areas", "Color Group", "Names", "Flags / Graphics", "Production"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Areas")
  useEffect(() => {
    if (location.search.includes("?view=Color Group")) {
      setView("Color Group")
    }
    if (location.search.includes("?view=Names")) {
      setView("Names")
    }
    if (location.search.includes("?view=Flags / Graphics")) {
      setView("Flags / Graphics")
    }
    if (location.search.includes("?view=production")) {
      setView("Production")
    }

  }, [location])


  const CurrentView = () => {
    switch (view) {
      case "Flags / Graphics":
        return (
          <GraphicForm />
        )
      case "Areas":
        return (
          <AreasForm />
        )
      case "Color Group":
        return (
          <ColorGroupForm />
        )
      case "Names":
        return (
          <NamesForm />
        )
      case "Production":
        return (
          <ProductionForm />
        )
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
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


    </>
  )
}

export default Overview
