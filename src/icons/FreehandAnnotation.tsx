import React from "react";

export const FreehandAnnotation = ({ color }: { color: string }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Pen selection</title>
      <g
        id="Pen-selection"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Group" transform="translate(-0.000000, -0.000000)">
          <g
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(3.000000, 3.000000)"
            id="Path"
            stroke={color}
            strokeWidth="1.5"
          >
            <path d="M14.3500001,1.196 L6.31300003,8.22800003 C5.44200002,8.99000004 5.39800002,10.329 6.21600003,11.147 L7.36500003,12.2960001 C8.18300003,13.1140001 9.52300004,13.0690001 10.284,12.1990001 L17.3160001,4.16200002 C18.0450001,3.33000001 18.0030001,2.07500001 17.2210001,1.29200001 C16.4380001,0.509000002 15.1830001,0.468000002 14.3500001,1.196 Z"></path>
            <line x1="7.87000003" y1="6.87000003" x2="11.65" y2="10.65"></line>
            <path d="M0.599000002,17.3230001 L4.30200002,17.3230001 C7.28700003,17.3230001 8.78200004,13.7140001 6.67100003,11.603 C5.11900002,10.051 2.48300001,10.622 1.71300001,12.6770001 L0.191000001,16.7350001 C0.0850000004,17.0200001 0.295000001,17.3230001 0.599000002,17.3230001 Z"></path>
          </g>
          <polygon
            id="Path"
            points="0 0 24.0000001 0 24.0000001 24.0000001 0 24.0000001"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};
