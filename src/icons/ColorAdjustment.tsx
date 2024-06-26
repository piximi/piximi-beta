import React from "react";

export const ColorAdjustment = ({ color }: { color: string }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Color adjustment</title>
      <g
        id="Color-adjustment"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Path" transform="translate(-0.000000, -0.000000)">
          <polygon points="0 0 24.0000001 0 24.0000001 24.0000001 0 24.0000001"></polygon>
          <path
            d="M8.25100003,21.5020001 C4.80400002,21.5020001 2.00000001,18.6980001 2.00000001,15.2510001 C2.00000001,11.804 4.80400002,9.00000004 8.25100003,9.00000004 C11.698,9.00000004 14.5020001,11.804 14.5020001,15.2510001 C14.5020001,18.6980001 11.698,21.5020001 8.25100003,21.5020001 Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M15.7490001,21.5020001 C12.3020001,21.5020001 9.49800004,18.6980001 9.49800004,15.2510001 C9.49800004,11.804 12.3020001,9.00000004 15.7490001,9.00000004 C19.1960001,9.00000004 22.0000001,11.804 22.0000001,15.2510001 C22.0000001,18.6980001 19.1960001,21.5020001 15.7490001,21.5020001 Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12.0100001,15.0000001 C8.56300004,15.0000001 5.75900002,12.1960001 5.75900002,8.74900004 C5.75900002,5.30200002 8.56300004,2.49800001 12.0100001,2.49800001 C15.4570001,2.49800001 18.2610001,5.30200002 18.2610001,8.74900004 C18.2610001,12.1960001 15.4570001,15.0000001 12.0100001,15.0000001 Z"
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
