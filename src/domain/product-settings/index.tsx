import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"

const ProductSettingsRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
    </Routes>
  )
}

export default ProductSettingsRoute
