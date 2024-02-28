import clsx from "clsx"
import React from "react"

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div
          className={clsx(
            "flex h-12 w-full animate-pulse gap-3 rounded border-b "
          )}
        >
          <div className="w-full animate-pulse rounded border bg-gray-100 "></div>
          <div className="w-full animate-pulse rounded border bg-gray-100 delay-200 "></div>
          <div className="w-full animate-pulse rounded border bg-gray-100 delay-300 "></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {Array.from(Array(10).keys()).map((val, index) => {
          const delay = `delay-[${index * 100}ms]`
          return (
            <div
              key={val}
              className={clsx(
                "block h-14 w-full animate-pulse rounded border bg-gray-100 ",
                `delay-[${delay}]`
              )}
            />
          )
        })}
      </div>
    </div>
  )
}

export default LoadingSkeleton
