import React from "react";

import { ListItem, ListItemIcon, SvgIcon } from "@mui/material";

import { TooltipCard } from "components/common/styled/ToolTipCard";
import { ToolHotkeyTitle } from "components/common/styled/ToolHotkeyTitle";

type ToolProps = {
  children: React.ReactNode;
  name: string;
  onClick: () => void;
};

const toolTipMap: Record<string, { name: string; letter: string }> = {
  Pointer: { name: "Select annotations", letter: "S" },
  "Rectangular annotation": { name: "Rectangular annotation", letter: "R" },
  "Elliptical annotation": { name: "Elliptical annotation", letter: "E" },
  "Freehand annotation": { name: "Pen annotation", letter: "D" },
  "Lasso annotation (L)": { name: "Lasso annotation", letter: "L" },
  "Polygonal annotation": { name: "Polygonal annotation", letter: "P" },
  "Magnetic annotation": { name: "Magnetic annotation", letter: "M" },
  "Color annotation": { name: "Color annotation", letter: "C" },
  "Quick annotation": { name: "Quick annotation", letter: "Q" },
  "Threshold annotation": { name: "Threshold annotation", letter: "T" },
  Hand: { name: "Hand tool", letter: "H" },
  Zoom: { name: "Zoom tool", letter: "Z" },
  "Color Adjustment": { name: "Color Adjustment", letter: "I" },
};

export const Tool = ({ children, name, onClick }: ToolProps) => {
  let toolName = name,
    HKLetter;

  if (!Object.keys(toolTipMap).includes(name)) {
    if (name === "Object annotation") {
      HKLetter =
        "Select a rectangular annotation around a desired object to automatically generate its boundaries.";
    } else {
      HKLetter = "";
    }
  } else {
    const tool = toolTipMap[name];
    toolName = tool.name;
    HKLetter = tool.letter;
  }
  const description = <ToolHotkeyTitle toolName={toolName} letter={HKLetter} />;

  return (
    <TooltipCard name={toolName} letter={HKLetter} description={description}>
      <ListItem button onClick={onClick}>
        <ListItemIcon>
          <SvgIcon fontSize="small">{children}</SvgIcon>
        </ListItemIcon>
      </ListItem>
    </TooltipCard>
  );
};