import React, {
  type MouseEvent,
  useCallback,
  useContext,
  useState,
} from "react"
import { PollingContext } from "../../../context/polling"
import useToggleState from "../../../hooks/use-toggle-state"
import Button from "../../fundamentals/button"
import HelpCircleIcon from "../../fundamentals/icons/help-circle"
import NotificationBell from "../../molecules/notification-bell"
import SearchBar from "../../molecules/search-bar"
import ActivityDrawer from "../activity-drawer"
import MailDialog from "../help-dialog"

const Topbar: React.FC = () => {
  const {
    state: activityDrawerState,
    toggle: toggleActivityDrawer,
    close: activityDrawerClose,
  } = useToggleState(false)

  const { batchJobs } = useContext(PollingContext)

  const [showSupportform, setShowSupportForm] = useState(false)

  const onNotificationBellClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      toggleActivityDrawer()
    },
    [toggleActivityDrawer]
  )

  return (
    <div id="topbar-menu" className="sticky top-0 z-40 flex items-center justify-between w-full border-b min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-grey-20">
      <SearchBar />
      <div className="flex items-center">



      </div>
  
    </div>
  )
}

export default Topbar
