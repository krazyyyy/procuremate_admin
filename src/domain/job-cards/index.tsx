import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"
import JobCard from "./edit/job-card"
import JobCardPrint from "./edit/job-card-print"
const JobCardsRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
      <Route path="/:id" element={<JobCard />} />
      <Route path="/print/:id" element={<JobCardPrint />} />
    </Routes>
  )
}

export default JobCardsRoute
