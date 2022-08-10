import React from "react";
import { bindMenu } from "material-ui-popup-state";

import { Divider, Menu } from "@mui/material";

import { OpenImageMenuItem } from "./OpenImageMenuItem";
import { OpenProjectFileMenuItem } from "./OpenProjectFileMenuItem";
import { OpenExampleImageMenuItem } from "./OpenExampleImageMenuItem";

type OpenMenuProps = {
  popupState: any;
};

export const OpenMenu = ({ popupState }: OpenMenuProps) => {
  return (
    <Menu {...bindMenu(popupState)}>
      <OpenImageMenuItem popupState={popupState} />

      <OpenProjectFileMenuItem popupState={popupState} />

      <Divider />

      <OpenExampleImageMenuItem popupState={popupState} />
    </Menu>
  );
};
