import { useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "store/annotator";
import { ToolType } from "types";

export const Hand = ({ color }: { color: string }) => {
  const theme = useTheme();
  const toolType = useSelector(toolTypeSelector);
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Hand</title>
      <g
        id="Hand"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="Group" transform="translate(-0.005000, -0.005000)">
          <polygon id="Path" points="0 0 24.01 0 24.01 24.01 0 24.01"></polygon>
          <g
            stroke-linecap="round"
            stroke-linejoin="round"
            transform="translate(3.005000, 3.005000)"
            id="Path"
            stroke={color}
            stroke-width="1.5"
          >
            <path d="M0.876688223,7.82337055 C1.82416266,7.02907695 3.20659866,7.09971911 4.07146412,7.98533063 L5.53482321,9.47915396 L5.53482321,3.45217126 C5.53482321,1.10030408 7.78886826,-0.560648269 9.97210561,0.183678925 L14.6976765,1.79294189 C16.0750548,2.26159234 17.0039844,3.57967175 17.0039844,5.06143422 L17.0039844,12.1222047 C17.0039844,15.4044809 14.3992726,18.0664844 11.1876378,18.0664844 L8.44636831,18.0664844 C6.61379765,18.0664844 4.88912444,17.1843188 3.78991922,15.6853265 L0.478816396,11.165951 C-0.284895203,10.1218254 -0.109561856,8.64867779 0.876688223,7.82337055 L0.876688223,7.82337055 Z"></path>
          </g>
        </g>
      </g>
    </svg>
  );
};
