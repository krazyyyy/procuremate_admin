import React, { useEffect, useState, useRef } from "react"
import BodyCard from "../../../components/organisms/body-card"
import Medusa from "../../../services/api"
import { Chart, ChartItem, registerables } from "chart.js"
import Table from "../../../components/molecules/table"
// Register the LineController
Chart.register(...registerables)

const Overview = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [lineChartData, setLineChartData] = useState<any>(null)
  const [ordersChartData, setOrdersChartData] = useState<any>(null)
  const [doughnutChartData, setDoughnutChartData] = useState<any>(null)
  const lineChartRef = useRef<any>(null)
  const ordersChartRef = useRef<any>(null)
  const doughnutChartRef = useRef<any>(null)
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [startProductDate, setStartProductDate] = useState()
  const [startOrderDate, setStartOrderDate] = useState()
  const [endOrderDate, setEndOrderDate] = useState()
  const [endProductDate, setEndProductDate] = useState()

  const fetchDataProduct = async () => {
    try {
      setIsLoading(true) // Start loading
      // Get the data using start and end date
      const response = await Medusa.dashboard.getProductSales(
        startProductDate,
        endProductDate
      )
      const data = response.data.data
      setTableData(data) // Update the table data state
      setIsLoading(false) // Stop loading
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setIsLoading(false) // Stop loading in case of error
    }
  }

  useEffect(() => {
    fetchDataProduct()
  }, [startProductDate, endProductDate])

  // Set the default start and end date
  useEffect(() => {
    // Fetch data when startDate or endDate changes
    fetchData()
  }, [startDate, endDate])

  // Set the default start and end date
  useEffect(() => {
    // Fetch data when startDate or endDate changes
    fetchOrdersData()
  }, [startOrderDate, endOrderDate])

  const fetchData = async () => {
    try {
      // Get the data using start and end date
      const { data: response } = await Medusa.dashboard.getSales(
        startDate,
        endDate
      )
      const { data } = response
      if (data) {
        // Prepare the line chart data
        const labels: string[] = data["ready_made_sale"].map((item: any) =>
          Object.keys(item).at(0)
        )
        const readyMadeData: any = data["ready_made_sale"].map((item: any) =>
          Object.values(item).at(0)
        )
        const customData: any = data["custom_sale"].map((item) =>
          Object.values(item).at(0)
        )
        const lineChartData = {
          labels: labels,
          datasets: [
            {
              label: "Ready Made Sale",
              data: readyMadeData,
              borderColor: "#FFCC4F",
              backgroundColor: "#cca0328f",
              fill: true,
            },
            {
              label: "Custom Sale",
              data: customData,
              borderColor: "rgba(35, 162, 101, 1)",
              backgroundColor: "rgba(35, 162, 101, 0.1)",
              fill: true,
            },
          ],
        }

        // Prepare the doughnut chart data
        const doughnutLabels = ["Ready Made Sale", "Custom Sale"]
        const doughnutData = [
          readyMadeData.reduce((a, b) => a + b, 0),
          customData.reduce((a, b) => a + b, 0),
        ]

        const doughnutChartData = {
          labels: doughnutLabels,
          datasets: [
            {
              data: doughnutData,
              backgroundColor: ["#FFCC4F", "#23A265"],
              borderWidth: 0,
            },
          ],
        }

        // Destroy the existing line chart if it exists
        if (lineChartRef.current) {
          lineChartRef.current.destroy()
        }

        // Destroy the existing doughnut chart if it exists
        if (doughnutChartRef.current) {
          doughnutChartRef.current.destroy()
        }
        setLineChartData(lineChartData)
        setDoughnutChartData(doughnutChartData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }
  const fetchOrdersData = async () => {
    try {
      // Get the data using start and end date
      const { data: response } = await Medusa.dashboard.getOrders(
        startOrderDate,
        endOrderDate
      )
      const { data } = response
      if (data) {
        // Prepare the line chart data
        const labels: string[] = data.map((item) => Object.keys(item).at(0))
        const orderChartData = {
          labels: labels,
          datasets: [
            {
              label: "Total Orders",
              data: data.map((item) => Object.values(item).at(0)),
              borderColor: "#FFCC4F",
              backgroundColor: "#cca0328f",
              fill: true,
            },
          ],
        }
        if (ordersChartRef?.current) {
          ordersChartRef.current?.destroy()
        }
        setOrdersChartData(orderChartData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  useEffect(() => {
    // Create the line chart when lineChartData is set
    if (lineChartData) {
      const ctx = document.getElementById("line-chart")
      lineChartRef.current = new Chart(ctx as ChartItem, {
        type: "line",
        data: lineChartData,
        options: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 300,
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
              mode: "nearest",
              intersect: false,
              padding: 10,
            },
          },
          drawOnChartArea: true,
          responsive: true,
          display: true,
          scales: {
            y: {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                  return "$" + value
                },
              },
            },
          },
        },
      })
    }
  }, [lineChartData])

  useEffect(() => {
    // Create the line chart when lineChartData is set
    if (ordersChartData) {
      const ctx = document.getElementById("line-chart-orders")
      ordersChartRef.current = new Chart(ctx as ChartItem, {
        type: "line",
        data: ordersChartData,
        options: {
          plugins: {
            tooltip: {
              enabled: true,
              mode: "nearest",
              intersect: false,
              padding: 10,
            },
          },
          responsive: true,
          scales: {
            // x: {
            //   type: "time",
            //   time: {
            //     displayFormats: {
            //       quarter: "MMM YYYY",
            //     },
            //   },
            // },
          },
        },
      })
    }
  }, [ordersChartData])

  useEffect(() => {
    // Create the doughnut chart when doughnutChartData is set
    if (doughnutChartData) {
      const ctx = document.getElementById("doughnut-chart")
      doughnutChartRef.current = new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: doughnutChartData,
        options: { responsive: true },
      })
    }
  }, [doughnutChartData])

  // const handleDateRangeChange = (start, end) => {
  //   setStartDate(start)
  //   setEndDate(end)
  // }

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
    setStartProductDate(defaultStartDateFormatted)
    setEndProductDate(defaultEndDate)
    setStartOrderDate(defaultStartDateFormatted)
    setEndOrderDate(defaultEndDate)
  }, [defaultStartDateFormatted, defaultEndDate])

  return (
    <>
      <div className="flex h-full grow flex-col gap-3">
        <div className="flex w-full grow flex-col">
          <BodyCard title="Gross Sale" forceDropdown={false}>
            <div className="mb-4 flex items-center justify-end gap-2">
              <input
                type="date"
                className="rounded border p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="rounded border p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className="rounded border bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                onClick={fetchData}
              >
                Apply
              </button>
            </div>
            <canvas id="line-chart"></canvas>
            {ordersChartData && (
              <>
                <div className="mt-6 flex h-xlarge items-center justify-between">
                  <h1 className="inter-xlarge-semibold text-grey-90">
                    Total Orders
                  </h1>
                </div>
                <div className="mb-4 flex items-center justify-end gap-2">
                  <input
                    type="date"
                    className="rounded border p-2"
                    value={startOrderDate}
                    onChange={(e) => setStartOrderDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="rounded border p-2"
                    value={endOrderDate}
                    onChange={(e) => setEndOrderDate(e.target.value)}
                  />
                  <button
                    className="rounded border bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                    onClick={fetchData}
                  >
                    Apply
                  </button>
                </div>
                <canvas id="line-chart-orders"></canvas>
              </>
            )}
          </BodyCard>
        </div>
        <div className="flex gap-3">
          <BodyCard title="Overview">
            {doughnutChartData && (
              <>
                <div className="m-[25px] mb-4 flex items-center justify-end gap-2">
                  <input
                    type="date"
                    className="rounded border p-1.5"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="rounded border p-1.5"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <button
                    className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                    onClick={fetchData}
                  >
                    Apply
                  </button>
                </div>
                <canvas id="doughnut-chart"></canvas>
              </>
            )}
          </BodyCard>
          <BodyCard title="Gross Sales By Product">
            <div className="mb-4 flex justify-between gap-2">
              <div className="w-1/3">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartProductDate(e.target.value)}
                  className="sm:text-sm mt-1 block w-full rounded border p-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="w-1/3">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndProductDate(e.target.value)}
                  className="sm:text-sm mt-1 block w-full rounded border p-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="w-1/3"></div>
            </div>

            <Table>
              <Table.Head>
                <Table.HeadRow>
                  <Table.HeadCell>Product</Table.HeadCell>
                  <Table.HeadCell>QTY</Table.HeadCell>
                </Table.HeadRow>
              </Table.Head>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={2}>Loading...</Table.Cell>
                  </Table.Row>
                ) : (
                  tableData.map((item, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{item.variantTitle}</Table.Cell>
                      <Table.Cell>{item.totalSold}</Table.Cell>
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
