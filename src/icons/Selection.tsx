import React from "react";

export const Selection = ({ color }: { color: string }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Pointer</title>
      <g
        id="Pointer"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Path" transform="translate(-0.000000, -0.000000)">
          <polygon points="0 0 24.0000001 0 24.0000001 24.0000001 0 24.0000001"></polygon>
          <path
            d="M19.7110001,15.5010001 C20.1020001,15.8920001 20.1020001,16.5250001 19.7110001,16.9150001 L16.9160001,19.7100001 C16.5250001,20.1010001 15.8920001,20.1010001 15.5020001,19.7100001 L12.0000001,16.2080001 L9.90400004,18.3040001 C9.37800004,18.8300001 8.48300004,18.6180001 8.24800003,17.9130001 L4.04800002,5.31200002 C3.78700002,4.53100002 4.53100002,3.78700002 5.31300002,4.04800002 L17.9140001,8.24800003 C18.6190001,8.48300004 18.8310001,9.37800004 18.3050001,9.90400004 L16.2090001,11.999 L19.7110001,15.5010001 Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </g>
    </svg>
  );
};
