import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"

const DashboardRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
    </Routes>
  )
}

export default DashboardRoute
