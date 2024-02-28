import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"
import EditSizeGuide from "./edit/edit-size-guide"

const SizeGuideRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
      <Route path="/:id" element={<EditSizeGuide />} />
    </Routes>
  )
}

export default SizeGuideRoute
