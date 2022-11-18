import React from "react";

export const MagneticAnnotation = ({ color }: { color: string }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Magnetic selection</title>
      <g
        id="Magnetic-selection"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          id="Group"
          transform="translate(2.995000, 2.995000)"
          stroke={color}
          stroke-width="1.5"
        >
          <line
            x1="15.1525604"
            y1="13.35081"
            x2="11.8391804"
            y2="10.0364296"
            id="Path"
          ></line>
          <line
            x1="7.97357042"
            y1="6.17081958"
            x2="4.65919"
            y2="2.85743958"
            id="Path"
          ></line>
          <path
            d="M8.75389542,0.324384583 L10.505625,2.07611417 C10.9368635,2.50774241 10.9368635,3.20713676 10.505625,3.638765 L5.487535,8.65585458 C4.41981785,9.72359699 4.41981785,11.4547226 5.487535,12.522465 C6.55527738,13.5901821 8.28640301,13.5901821 9.35414542,12.522465 L14.371235,7.504375 C14.8028633,7.07313649 15.5022576,7.07313649 15.9338858,7.504375 L17.6856154,9.25610458 C17.8936381,9.46269483 18.0106252,9.74375249 18.0106252,10.0369298 C18.0106252,10.3301071 17.8936381,10.6111648 17.6856154,10.817755 L12.6675254,15.835845 C9.76959655,18.7328702 5.07208391,18.7328702 2.174155,15.835845 C-0.722870151,12.9379161 -0.722870151,8.24040345 2.174155,5.34247458 L7.192245,0.324384583 C7.39883524,0.116361933 7.6798929,-0.000625150988 7.97307021,-0.000625150988 C8.26624751,-0.000625150988 8.54730517,0.116361933 8.75389542,0.324384583 Z"
            id="Path"
          ></path>
        </g>
        <polygon
          id="Path"
          points="-0.005 -0.005 24.005 -0.005 24.005 24.005 -0.005 24.005"
        ></polygon>
      </g>
    </svg>
  );
};
