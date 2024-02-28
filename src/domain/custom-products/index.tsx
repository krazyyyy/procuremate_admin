import { Route, Routes } from "react-router-dom"
import Edit from "./edit"
import Overview from "./overview"
import React from "react"
import EditSize from "./edit/edit-size"
import EditStyle from "./edit/edit-style"

const CustomProductsRoute = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="/:id" element={<Edit />} />
      <Route path="/sizing/:id" element={<EditSize />} />
      <Route path="/style/:id" element={<EditStyle />} />
    </Routes>
  )
}

export default CustomProductsRoute
