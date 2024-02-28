import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"
import EditGraphic from "./edit/edit-graphic"
import EditGraphicMain from "./edit/edit-graphic-main"

const GraphicsRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
      <Route path="/graphic/:id" element={<EditGraphic />} />
      <Route path="/pricing/:id" element={<EditGraphicMain />} />
    </Routes>
  )
}

export default GraphicsRoute
