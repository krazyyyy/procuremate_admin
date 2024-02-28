import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"
import EditColor from "./edit/edit-color"
import EditMaterial from "./edit/edit-material"
import EditMaterialType from "./edit/edit-material-type"
const MatrialsRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
      <Route path="/color/:id" element={<EditColor />} />
      <Route path="/material/:id" element={<EditMaterial />} />
      <Route path="/type/:id" element={<EditMaterialType />} />
    </Routes>
  )
}

export default MatrialsRoute
