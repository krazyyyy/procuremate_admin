import clsx from "clsx";
import React, { useMemo, useEffect, useState } from "react";
import { useAdminProductTags, useAdminCollections } from "medusa-react";
import CheckIcon from "../../components/fundamentals/icons/check-icon";
import PlusIcon from "../../components/fundamentals/icons/plus-icon";
import FilterDropdownContainer from "../../components/molecules/filter-dropdown/container";
import FilterDropdownItem from "../../components/molecules/filter-dropdown/item";
import SaveFilterItem from "../../components/molecules/filter-dropdown/save-field";
import TagInput from "../../components/molecules/tag-input";
import TabFilter from "../../components/molecules/filter-tab";

const COLLECTION_PAGE_SIZE = 10;

const CustomFilter = ({
  filters,
  submitFilters,
  clearFilters,
  tabs,
  onTabClick,
  activeTab,
  onRemoveTab,
  onSaveTab,
}) => {
  const [tempState, setTempState] = useState(filters);
  const [name, setName] = useState("");

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val);
    }
  };

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState);
    }
  };

  const handleTabClick = (tabName) => {
    if (onTabClick) {
      onTabClick(tabName);
    }
  };

  useEffect(() => {
    setTempState(filters);
  }, [filters]);

  const onSubmit = () => {
    submitFilters(tempState);
  };

  const onClear = () => {
    clearFilters();
  };

  const numberOfFilters = useMemo(
    () =>
      Object.entries(filters || {}).reduce((acc, [, value]) => {
        if (value?.open) {
          acc = acc + 1;
        }
        return acc;
      }, 0),
    [filters]
  );

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }));
  };

  const [collectionsPagination, setCollectionsPagination] = useState({
    offset: 0,
    limit: COLLECTION_PAGE_SIZE,
  });

  const {
    collections,
    count,
    isLoading: isLoadingCollections,
  } = useAdminCollections(collectionsPagination);

  const { product_tags } = useAdminProductTags();

  const handlePaginateCollections = (direction) => {
    if (direction > 0) {
      setCollectionsPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    } else if (direction < 0) {
      setCollectionsPagination((prev) => ({
        ...prev,
        offset: Math.max(prev.offset - prev.limit, 0),
      }));
    }
  };

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
        {/* Render your filter dropdown items dynamically based on the filters object */}
        {Object.entries(filters).map(([filterKey, filterValue]) => (
          <FilterDropdownItem
            key={filterKey}
            filterTitle={filterValue.title}
            options={filterValue.options}
            isLoading={filterValue.isLoading}
            hasPrev={filterValue.hasPrev}
            hasMore={filterValue.hasMore}
            onShowPrev={filterValue.onShowPrev}
            onShowNext={filterValue.onShowNext}
            filters={filterValue.filter}
            open={filterValue.open}
            setFilter={(v) => setSingleFilter(filterKey, v)}
          />
        ))}

        {/* Add additional filter components as needed */}

        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      {tabs &&
        tabs.map((t) => (
          <TabFilter
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            label={t.label}
            isActive={activeTab === t.value}
            removable={!!t.removable}
            onRemove={() => handleRemoveTab(t.value)}
          />
        ))}
    </div>
  );
};

export default CustomFilter;
