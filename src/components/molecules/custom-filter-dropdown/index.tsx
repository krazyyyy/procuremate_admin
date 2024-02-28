import * as RadixCollapsible from "@radix-ui/react-collapsible"
import * as RadixPopover from "@radix-ui/react-popover"
import clsx from "clsx"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { DateFilters } from "../../../utils/filters"
import { addHours, atMidnight, dateToUnixTimestamp } from "../../../utils/time"
import { CalendarComponent } from "../../atoms/date-picker/date-picker"
import Spinner from "../../atoms/spinner"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"
import InputField from "../input"

const DAY_IN_SECONDS = 86400

const CustomFilterDropdownItem = ({
  filterTitle,
  options,
  filters,
  open,
  setFilter,
  isLoading,
  hasMore,
  hasPrev,
  onShowNext,
  onShowPrev,
}) => {
  const prefilled = useMemo(() => {
    try {
      const toReturn = filters.reduce((acc, f) => {
        acc[f] = true
        return acc
      }, {})
      return toReturn
    } catch (e) {
      return {}
    }
  }, [filters])

  const [selected, setSelected] = useState(prefilled)

  const handlePrev = () => {
    if (onShowPrev) {
      onShowPrev()
    }
  }

  const handleNext = () => {
    if (onShowNext) {
      onShowNext()
    }
  }

  useEffect(() => {
    if (!open) {
      setSelected({})
    }
  }, [open])

  const onSelect = (filter) => {
    const newSelected = {
      [filter]: true
    };

    setSelected(newSelected);
    setFilter({ open: open, filter: [filter] });
  }

  return (
    <div
      className={clsx("w-full cursor-pointer", {
        "inter-small-semibold": open,
        "inter-small-regular": !open,
      })}
    >
      <RadixCollapsible.Root
        className="w-full"
        open={open}
        onOpenChange={(open) => setFilter({ filter: filters, open })}
      >
        <RadixCollapsible.Trigger
          className={clsx(
            "py-1.5 px-3 flex w-full items-center hover:bg-grey-5 rounded justify-between",
            {
              "inter-small-semibold": open,
              "inter-small-regular": !open,
            }
          )}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                open && "bg-violet-60"
              }`}
            >
              <span className="self-center">
                {open && <CheckIcon size={16} />}
              </span>
            </div>
            <input
              id={filterTitle}
              className="hidden"
              checked={open}
              readOnly
              type="checkbox"
            />
            <span className="ml-2">{filterTitle}</span>
          </div>
          {open && (
            <span className="text-grey-50 self-end">
              <ChevronUpIcon size={20} />
            </span>
          )}
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content className="w-full">
          {hasPrev && (
            <div className="py-2 pl-6 flex">
              <button
                className="flex items-center text-violet-50"
                onClick={handlePrev}
              >
                <ArrowRightIcon className="transform rotate-180 mr-1" />
                Previous
              </button>
            </div>
          )}
          <div className="py-2 w-full max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner />
              </div>
            ) : (
              options.map((option, index) => (
                <div
                  key={index}
                  className="py-1.5 px-6 hover:bg-grey-5 cursor-pointer"
                  onClick={() => onSelect(option)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                        selected[option] && "bg-violet-60"
                      }`}
                    >
                      <span className="self-center">
                        {selected[option] && <CheckIcon size={16} />}
                      </span>
                    </div>
                    <span className="ml-2">{option}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          {hasMore && (
            <div className="py-2 pl-6 flex">
              <button
                className="flex items-center text-violet-50"
                onClick={handleNext}
              >
                Next
                <ArrowRightIcon className="ml-1" />
              </button>
            </div>
          )}
        </RadixCollapsible.Content>
      </RadixCollapsible.Root>
    </div>
  )
}

export default CustomFilterDropdownItem
