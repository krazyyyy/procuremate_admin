import React from "react"

const LoginLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid grid-cols-1 grid-rows-1 min-h-screen">
        <div
          className="flex flex-col items-center"
          style={{
            background: "linear-gradient(90deg, rgba(159,155,69,1) 19%, rgba(255,248,0,1) 48%, rgba(159,155,69,1) 100%, rgba(159,155,69,1) 100%)",
          }}
        >
          {children}
          <div className="text-black-0 inter-base-regular pb-12">
            © Procuremate <span>&#183;</span>{" "}
            <a
              style={{ color: "inherit", textDecoration: "none" }}
              href="/"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginLayout
