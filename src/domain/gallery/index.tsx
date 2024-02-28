import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"
import EditGallery from "./edit/edit-gallery"
const GallaryRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
      <Route path="/:id" element={<EditGallery />} />
    </Routes>
  )
}

export default GallaryRoute
