import React from "react"
import IconProps from "./types/icon-type"

const EmailIcon : React.FC < IconProps > = ({
    size = "24px",
    color = "currentColor",
    ...attributes
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.0728 1.66902L11.5 1.3909V8.75C11.5 9.18079 11.1648 9.5 10.8 9.5H1.2C0.835183 9.5 0.5 9.18079 0.5 8.75V1.3909L0.927199 1.66902L5.7272 4.79402L6 4.97163L6.2728 4.79402L11.0728 1.66902ZM11.3199 0.75H10.8H1.2H0.680093C0.811825 0.594477 1.00153 0.5 1.2 0.5H10.8C10.9985 0.5 11.1882 0.594477 11.3199 0.75ZM10.8 9.25H11.3V8.75V2.5V1.57785L10.5272 2.08098L6 5.02837L1.4728 2.08098L0.7 1.57785V2.5V8.75V9.25H1.2H10.8Z"
                fill={color}
                stroke="black"/>
        </svg>

    )
}

export default EmailIcon
