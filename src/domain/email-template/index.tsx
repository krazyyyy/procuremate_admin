import { Route, Routes } from "react-router-dom"
import Overview from "./overview"
import React from "react"
import EditEmail from "./edit/edit-email"
const EmailTemplateRoute = () => {

  return (
    <Routes>
      <Route index element={<Overview  />} />
      <Route path="/:id" element={<EditEmail />} />
    </Routes>
  )
}

export default EmailTemplateRoute
