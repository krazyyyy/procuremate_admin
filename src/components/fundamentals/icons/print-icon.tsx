import React from "react";
import IconProps from "./types/icon-type";

const PrintIcon: React.FC<IconProps> = ({
  size = "20px",
  color = "currentColor",
  onClick,
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick} // Attach onClick event handler
      {...attributes}
    >
      <path d="M13.5 8.5H3.5V16H13.5V8.5Z" stroke="#757575" />
      <path d="M6 13.5H11" stroke="#757575" />
      <path d="M6 11H11" stroke="#757575" />
      <path d="M4.75 3.5V1H12.25V3.5" stroke="#757575" />
      <path d="M3.5 11H1V3.5H16V11H13.5" stroke="#757575" />
    </svg>
  );
};

export default PrintIcon;
