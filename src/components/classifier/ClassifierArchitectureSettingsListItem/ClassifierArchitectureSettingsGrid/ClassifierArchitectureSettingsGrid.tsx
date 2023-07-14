import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Autocomplete, Grid, TextField } from "@mui/material";

import {
  CustomNumberTextField,
  StyledFormControl,
} from "components/common/styled-components";

import {
  classifierInputShapeSelector,
  classifierSelectedModelIdxSelector,
  classifierSlice,
} from "store/classifier";

import { availableClassifierModels } from "types/ModelType";

type ArchitectureSettingsProps = {
  onModelSelect: (modelIdx: number) => void;
};

export const ClassifierArchitectureSettingsGrid = ({
  onModelSelect,
}: ArchitectureSettingsProps) => {
  const dispatch = useDispatch();

  const inputShape = useSelector(classifierInputShapeSelector);
  const selectedModel = useSelector(classifierSelectedModelIdxSelector);

  const [fixedNumberOfChannels, setFixedNumberOfChannels] =
    useState<boolean>(false);

  const [fixedNumberOfChannelsHelperText, setFixedNumberOfChannelsHelperText] =
    useState<string>("");

  const modelOptions = availableClassifierModels
    .map((m, i) => ({
      name: m.name,
      trainable: m.trainable,
      idx: i,
    }))
    .filter((m) => m.trainable);

  useEffect(() => {
    if (selectedModel.model.requiredChannels) {
      setFixedNumberOfChannels(true);
      setFixedNumberOfChannelsHelperText(
        `${selectedModel.model.name} requires ${selectedModel.model.requiredChannels} channels!`
      );
    } else {
      setFixedNumberOfChannels(false);
      setFixedNumberOfChannelsHelperText("");
    }
  }, [selectedModel]);

  const onSelectedModelChange = (
    event: React.SyntheticEvent<Element, Event>,
    modelOption: (typeof modelOptions)[number] | null
  ) => {
    if (!modelOption) return;
    onModelSelect(modelOption.idx);
  };

  const dispatchRows = (height: number) => {
    dispatch(
      classifierSlice.actions.updateInputShape({
        inputShape: { ...inputShape, height: height },
      })
    );
  };

  const dispatchCols = (cols: number) => {
    dispatch(
      classifierSlice.actions.updateInputShape({
        inputShape: { ...inputShape, width: cols },
      })
    );
  };

  const dispatchChannels = (channels: number) => {
    dispatch(
      classifierSlice.actions.updateInputShape({
        inputShape: { ...inputShape, channels: channels },
      })
    );
  };

  return (
    <StyledFormControl>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Autocomplete
            disableClearable={true}
            options={modelOptions}
            onChange={onSelectedModelChange}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="off"
                label="Model architecture"
              />
            )}
            value={{
              name: selectedModel.model.name,
              trainable: selectedModel.model.trainable,
              idx: selectedModel.idx,
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
          />
        </Grid>
      </Grid>
      <Grid container direction={"row"} spacing={2}>
        <Grid item xs={1}>
          <CustomNumberTextField
            id="shape-rows"
            label="Input rows"
            value={inputShape.height}
            dispatchCallBack={dispatchRows}
            min={1}
            disabled={!selectedModel.model.trainable}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomNumberTextField
            id="shape-cols"
            label="Input cols"
            value={inputShape.width}
            dispatchCallBack={dispatchCols}
            min={1}
            disabled={!selectedModel.model.trainable}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomNumberTextField
            id="shape-channels"
            label="Input channels"
            value={inputShape.channels}
            dispatchCallBack={dispatchChannels}
            min={1}
            disabled={fixedNumberOfChannels || !selectedModel.model.trainable}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={3} marginTop={1}>
          {fixedNumberOfChannels && (
            <Alert severity="info">{fixedNumberOfChannelsHelperText}</Alert>
          )}
        </Grid>
      </Grid>
    </StyledFormControl>
  );
};
