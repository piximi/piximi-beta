import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import produce from "immer";
import { tensor2d } from "@tensorflow/tfjs";
import { debounce } from "lodash";

import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
} from "@mui/material";

import { Palette } from "../Palette";

import { CollapsibleList } from "components/common/CollapsibleList";

import {
  imageViewerSlice,
  activeImageColorsRawSelector,
} from "store/image-viewer";

import { imageBitDepthSelector, imageDataSelector } from "store/common";

import {
  rgbToHex,
  scaleUpRange,
  scaleDownRange,
} from "image/utils/imageHelper";

import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from "icons";
import { useLocalGlobalState } from "hooks";

export const ChannelsList = () => {
  const dispatch = useDispatch();

  const imageData = useSelector(imageDataSelector);

  const imageBitDepth = useSelector(imageBitDepthSelector);

  const {
    localState: localActiveImageColors,
    setLocalState: setLocalActiveImageColors,
    dispatchState: dispatchActiveImageColors,
  } = useLocalGlobalState(
    activeImageColorsRawSelector,
    imageViewerSlice.actions.setImageColors,
    { range: {}, visible: {}, color: [] }
  );

  const handleSliderChange = useMemo(
    () =>
      debounce(
        (
          idx: number,
          newValue: [number, number],
          bitDepth: Exclude<typeof imageBitDepth, undefined>
        ) => {
          setLocalActiveImageColors(
            produce((draftColor) => {
              draftColor.range[idx] = scaleDownRange(newValue, bitDepth);
            })
          );
        },
        10
      ),
    [setLocalActiveImageColors]
  );

  const handleSliderChangeCommitted = async () => {
    dispatchActiveImageColors({
      colors: {
        ...localActiveImageColors,
        color: tensor2d(localActiveImageColors.color),
      },
      execSaga: true,
    });
  };

  const onCheckboxChanged = (index: number, enabled: boolean) => {
    const newColors = {
      visible: { ...localActiveImageColors.visible }, // copy so we can modify
      range: localActiveImageColors.range,
      color: tensor2d(localActiveImageColors.color),
    };
    newColors.visible[index] = enabled;

    dispatch(
      imageViewerSlice.actions.setImageColors({
        colors: newColors,
        execSaga: true,
      })
    );
  };

  const colorAdjustmentSlider = (index: number, name: string) => {
    const isVisible = localActiveImageColors.visible[index];

    if (!imageData || !imageBitDepth) return <></>;

    return (
      <ListItem dense key={index}>
        <ListItemIcon>
          <Checkbox
            onChange={(event) => onCheckboxChanged(index, event.target.checked)}
            checked={isVisible}
            disableRipple
            edge="start"
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary={name} />
        <Slider
          key={index}
          disabled={!isVisible}
          sx={{
            width: "50%",
            "& .MuiSlider-track": {
              color: (theme) =>
                isVisible
                  ? rgbToHex(localActiveImageColors.color[index])
                  : theme.palette.action.disabled,
            },
          }}
          value={scaleUpRange(
            localActiveImageColors.range[index],
            imageBitDepth
          )}
          max={2 ** imageBitDepth - 1}
          onChange={(event, value: number | number[]) =>
            handleSliderChange(index, value as [number, number], imageBitDepth)
          }
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
        <Palette channelIdx={index} />
      </ListItem>
    );
  };

  return (
    <CollapsibleList closed dense primary="Channels">
      {Array(localActiveImageColors.color.length)
        .fill(0)
        .map((_, i) => {
          return colorAdjustmentSlider(i, `Ch. ${i}`);
        })}
    </CollapsibleList>
  );
};
