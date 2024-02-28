import { Route, Routes } from "react-router-dom"
import Edit from "./edit"
import Overview from "./overview"

const CollectionRoute = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="/:id" element={<Edit />} />
    </Routes>
  )
}

export default CollectionRoute
