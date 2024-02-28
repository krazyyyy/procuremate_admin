import { useAdminStore } from "medusa-react"
import React, { useState } from "react"
import { useFeatureFlag } from "../../../context/feature-flag"
import BuildingsIcon from "../../fundamentals/icons/buildings-icon"
import CartIcon from "../../fundamentals/icons/cart-icon"
import CashIcon from "../../fundamentals/icons/cash-icon"
import GearIcon from "../../fundamentals/icons/gear-icon"
import GiftIcon from "../../fundamentals/icons/gift-icon"
import SaleIcon from "../../fundamentals/icons/sale-icon"
import TagIcon from "../../fundamentals/icons/tag-icon"
import UsersIcon from "../../fundamentals/icons/users-icon"
import SidebarMenuItem from "../../molecules/sidebar-menu-item"
import UserMenu from "../../molecules/user-menu"
import SwatchIcon from "../../fundamentals/icons/swatch-icon"
import GraphicIcon from "../../fundamentals/icons/graphic"
import SettingsIcon from "../../fundamentals/icons/settings"
import DiscountedIcon from "../../fundamentals/icons/discount"
import SizeIcon from "../../fundamentals/icons/size-icon"
import EmailIcon from "../../fundamentals/icons/email-icon"
import GalleryIcon from "../../fundamentals/icons/gallery-icon"
import DashboardIcon from "../../fundamentals/icons/dashboard-icon"
import MaterialIcon from "../../fundamentals/icons/material-icon"

const ICON_SIZE = 20

const Sidebar: React.FC = () => {
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)

  const { store } = useAdminStore()

  const triggerHandler = () => {
    const id = triggerHandler.id++
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    }
  }
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0

  const { isFeatureEnabled } = useFeatureFlag()

  const inventoryEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  return (
    <div id="sidebar-menu" className="h-screen overflow-y-auto border-r min-w-sidebar max-w-sidebar bg-gray-0 border-grey-20 py-base px-base">
      <div className="h-full">
        <div className="flex justify-between px-2">
          <div className="flex items-center justify-center w-8 h-8 border border-gray-300 border-solid rounded-circle">
            <UserMenu />
          </div>
        </div>
        <div className="flex flex-col px-2 my-base">
          <span className="font-medium text-grey-50 text-small">Store</span>
          <span className="font-medium text-grey-90 text-medium">
            {store?.name}
          </span>
        </div>
        <div className="py-3.5">
          <SidebarMenuItem
            pageLink={"/a/orders"}
            icon={<CartIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Orders"}
          />
          <SidebarMenuItem
            pageLink={"/a/job-cards"}
            icon={<CartIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Job Cards"}
          />
          <SidebarMenuItem
            pageLink={"/a/collection"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={"Collection"}
            triggerHandler={triggerHandler}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={"Products"}
            triggerHandler={triggerHandler}
          />
            <SidebarMenuItem
               pageLink={"/a/product-categories"}
               icon={<SwatchIcon size={ICON_SIZE} />}
               text={"Product Categories"}
               triggerHandler={triggerHandler}
             />
          <SidebarMenuItem
            pageLink={"/a/custom-products"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={"Custom Products"}
            triggerHandler={triggerHandler}
          />
          <SidebarMenuItem
            pageLink={"/a/materials"}
            icon={<MaterialIcon size={ICON_SIZE} />}
            text={"Materials"}
            triggerHandler={triggerHandler}
          />
           <SidebarMenuItem
              pageLink={"/a/product-settings"}
              icon={<SettingsIcon size={ICON_SIZE} />}
              text={"Customizer Settings"}
              triggerHandler={triggerHandler}
            />
            <SidebarMenuItem
              pageLink={"/a/graphics"}
              icon={<GraphicIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Graphics"}
            />
            <SidebarMenuItem
              pageLink={"/a/email-template"}
              icon={<EmailIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Emails"}
            />
          <SidebarMenuItem
            pageLink={"/a/size-guide"}
            icon={<SizeIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Size Guide"}
          />
          <SidebarMenuItem
            pageLink={"/a/customers"}
            icon={<UsersIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Customers"}
          />
          <SidebarMenuItem
            pageLink={"/a/gallery"}
            icon={<GalleryIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Gallery"}
          />
          {inventoryEnabled && (
            <SidebarMenuItem
              pageLink={"/a/inventory"}
              icon={<BuildingsIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Inventory"}
            />
          )}
          <SidebarMenuItem
            pageLink={"/a/discounts"}
            icon={<DiscountedIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Discounts"}
          />
            <SidebarMenuItem
              pageLink={"/a/dashboard"}
              icon={<DashboardIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Dashboard"}
              />
            <SidebarMenuItem
              pageLink={"/a/ready-made-sale"}
              icon={<DashboardIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Ready Made Sale"}
              />
            <SidebarMenuItem
              pageLink={"/a/custom-sale"}
              icon={<DashboardIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Custom Sale"}
              />
          {/* <SidebarMenuItem
            pageLink={"/a/gift-cards"}
            icon={<GiftIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Gift Cards"}
          />
          <SidebarMenuItem
            pageLink={"/a/pricing"}
            icon={<CashIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Pricing"}
          /> */}
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<GearIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Settings"}
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
