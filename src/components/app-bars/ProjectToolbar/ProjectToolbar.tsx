import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Slider, Toolbar, Box, Button, Typography } from "@mui/material";
import {
  ZoomOut as ZoomOutIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";

import { ImageSortSelection } from "components/styled-components";

import { UploadButton } from "components/controls";
import { LogoLoader } from "components/styled-components";

import { applicationSlice } from "store/application";
import { selectLoadMessage, selectLoadPercent } from "store/project";

export const ProjectToolbar = () => {
  const dispatch = useDispatch();
  const loadPercent = useSelector(selectLoadPercent);
  const loadMessage = useSelector(selectLoadMessage);
  const [value, setValue] = useState<number>(1);
  const minZoom = 0.6;
  const maxZoom = 4;

  const handleSizeChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    dispatch(
      applicationSlice.actions.updateTileSize({
        newValue: newValue as number,
      })
    );
  };

  const onZoomOut = () => {
    const newValue = value - 0.1 >= minZoom ? value - 0.1 : minZoom;
    setValue(newValue as number);
    dispatch(
      applicationSlice.actions.updateTileSize({
        newValue: newValue as number,
      })
    );
  };

  const onZoomIn = () => {
    const newValue = value + 0.1 <= maxZoom ? value + 0.1 : maxZoom;
    setValue(newValue as number);
    dispatch(
      applicationSlice.actions.updateTileSize({
        newValue: newValue as number,
      })
    );
  };

  return (
    <Toolbar>
      <LogoLoader width={250} height={50} loadPercent={loadPercent} />

      <Typography ml={5} sx={{ flexGrow: 1 }}>
        {loadMessage}
      </Typography>

      <Box sx={{ flexGrow: 1 }} />

      <ImageSortSelection />
      <Button onClick={onZoomOut}>
        <ZoomOutIcon
          sx={(theme) => ({
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          })}
        />
      </Button>

      <Slider
        value={value}
        min={minZoom}
        max={maxZoom}
        step={0.1}
        onChange={handleSizeChange}
        sx={{ width: "10%" }}
      />
      <Button onClick={onZoomIn}>
        <ZoomInIcon
          sx={(theme) => ({
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          })}
        />
      </Button>

      <UploadButton />
    </Toolbar>
  );
};