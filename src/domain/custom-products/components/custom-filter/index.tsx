import clsx from "clsx"
import React, { useMemo, useEffect, useState } from "react"
import { useAdminProductTags, useAdminCollections } from "medusa-react"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import FilterDropdownContainer from "../../../../components/molecules/filter-dropdown/container"
import FilterDropdownItem from "../../../../components/molecules/filter-dropdown/item"
import SaveFilterItem from "../../../../components/molecules/filter-dropdown/save-field"
import TagInput from "../../../../components/molecules/tag-input"
import TabFilter from "../../../../components/molecules/filter-tab"
import CustomFilterDropdownItem from "../../../../components/molecules/custom-filter-dropdown"
const statusFilters = ["proposed", "draft", "published", "rejected"]

const COLLECTION_PAGE_SIZE = 10

const CustomFilter = ({
  filters,
  submitFilters,
  clearFilters,
  tabs,
  onTabClick,
  activeTab,
  onRemoveTab,
  onSaveTab,
  listFilters=[
    "Ks"
  ],
  FilterTitle="1",
  setQuery,
}) => {

  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val)
    }
  }

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState)
    }
  }

  const handleTabClick = (tabName: string) => {
    if (onTabClick) {
      onTabClick(tabName)
    }

  }

  useEffect(() => {
    setTempState(filters)
  }, [filters])

  const onSubmit = () => {
    if (
        tempState['status']['filter'][0] &&
        tempState['status']['filter'][0] !== FilterTitle
      ) {
        setQuery(`${FilterTitle.toLowerCase().replace(" ", "_")}=${tempState['status']['filter'][0]}`);
      }
      
    submitFilters(tempState)
  }

  const onClear = () => {
    clearFilters()
  }

  const numberOfFilters = useMemo(
    () =>
      Object.entries(filters || {}).reduce((acc, [, value]) => {
        if (value?.open) {
          acc = acc + 1
        }
        return acc
      }, 0),
    [filters]
  )

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }


 
  return (
    <div className="flex space-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "flex rounded-rounded items-center space-x-1 focus-visible:outline-none focus-visible:shadow-input focus-visible:border-violet-60"
            )}
          >
            <div className="flex rounded-rounded items-center bg-grey-5 border border-grey-20 inter-small-semibold px-2 h-6">
              Filters
              <div className="text-grey-40 ml-1 flex items-center rounded">
                <span className="text-violet-60 inter-small-semibold">
                  {numberOfFilters ? numberOfFilters : "0"}
                </span>
              </div>
            </div>
            <div className="flex items-center rounded-rounded bg-grey-5 border border-grey-20 inter-small-semibold p-1">
              <PlusIcon size={14} />
            </div>
          </button>
        }
      >
        <CustomFilterDropdownItem
          filterTitle={FilterTitle}
          options={listFilters}
          filters={tempState?.status?.filter}
          open={tempState.status.open}
          setFilter={(v) => setSingleFilter("status", v)}
        />


        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
 
    </div>
  )
}


export default CustomFilter;
