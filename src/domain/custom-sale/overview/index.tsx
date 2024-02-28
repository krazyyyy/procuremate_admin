import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Table from "../../../components/molecules/table"
import BodyCard from "../../../components/organisms/body-card"
import Medusa from "../../../services/api"

const Overview = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch data when startDate or endDate changes
    fetchData()
  }, [startDate, endDate])

  const location = useLocation()
  const fetchData = async () => {
    try {
      setIsLoading(true) // Start loading
      // Get the data using start and end date
      const response = await Medusa.dashboard.getDayOrder(startDate, endDate, 0)
      const data = response.data.data
      setTableData(data) // Update the table data state
      setIsLoading(false) // Stop loading
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setIsLoading(false) // Stop loading in case of error
    }
  }

  const handleDateRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
  }

  // Helper function to format the date as "YYYY-MM-DD"
  const getFormattedDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Calculate the default start and end date (last 7 days)
  const currentDate = new Date()
  const defaultEndDate = getFormattedDate(currentDate)
  const defaultStartDate = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  )
  const defaultStartDateFormatted = getFormattedDate(defaultStartDate)

  // Set the default start and end date
  useEffect(() => {
    setStartDate(defaultStartDateFormatted)
    setEndDate(defaultEndDate)
  }, [defaultStartDateFormatted, defaultEndDate])

  return (
    <>
      <div className="flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard title="Custom Sales" forceDropdown={false}>
            <div className="mb-4 flex justify-between gap-4">
              <div className="w-1/3">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="sm:text-sm  mt-1 block w-full rounded-md border border-gray-300 p-1 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="w-1/3">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="sm:text-sm  mt-1 block w-full rounded-md border border-gray-300 p-1 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="w-1/3"></div>
            </div>
            <Table>
              <Table.Head>
                <Table.HeadRow>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Total Order</Table.HeadCell>
                  <Table.HeadCell>Total Shipping</Table.HeadCell>
                  <Table.HeadCell>Total Sales</Table.HeadCell>
                </Table.HeadRow>
              </Table.Head>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={4}>Loading...</Table.Cell>
                  </Table.Row>
                ) : (
                  tableData.map((item) => (
                    <Table.Row key={item.date}>
                      <Table.Cell>{item.date}</Table.Cell>
                      <Table.Cell>{item.totalOrders}</Table.Cell>
                      <Table.Cell>{item.totalShipping}</Table.Cell>
                      <Table.Cell>{item.totalSales}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </BodyCard>
        </div>
      </div>
    </>
  )
}

export default Overview
