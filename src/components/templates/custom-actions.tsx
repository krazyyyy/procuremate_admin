import clsx from "clsx"
import React from "react"
import TabFilter from "../../components/molecules/filter-tab"

const CustomAction = ({ onEdit, onDelete }) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  }

  return (
    <div className="flex space-x-1">
      <button
        className={clsx(
          "flex rounded-rounded items-center space-x-1 focus-visible:outline-none focus-visible:shadow-input focus-visible:border-violet-60"
        )}
        onClick={handleEdit}
      >
        <span className="text-grey-90 inter-small-regular">Edit</span>
      </button>
      <button
        className={clsx(
          "flex rounded-rounded items-center space-x-1 focus-visible:outline-none focus-visible:shadow-input focus-visible:border-violet-60"
        )}
        onClick={handleDelete}
      >
        <span className="text-grey-90 inter-small-regular">Delete</span>
      </button>
    </div>
  )
}

export default CustomAction
