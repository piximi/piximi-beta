import React, { useEffect, useState } from "react";

import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

import { useHotkeys } from "hooks";

import { LocalFileUpload } from "./LocalFileUpload";
import { PretrainedModelSelector } from "./PretrainedModelSelector";
import { CloudUpload } from "./CloudUpload";

import { HotkeyView, Shape } from "types";
import {
  ModelTask,
  availableClassifierModels,
  availableSegmenterModels,
} from "types/ModelType";
import { Model } from "utils/common/models/Model";
import { ModelFormatSelection } from "./ModelFormatSelection";

type ImportTensorflowModelDialogProps = {
  onClose: () => void;
  open: boolean;
  modelTask: ModelTask;
  dispatchFunction: (model: Model, inputShape: Shape) => void;
};

export const ImportTensorflowModelDialog = ({
  onClose,
  open,
  modelTask,
  dispatchFunction,
}: ImportTensorflowModelDialogProps) => {
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [inputShape, setInputShape] = useState<Shape>({
    height: 256,
    width: 256,
    channels: 3,
    planes: 1,
  });
  const [isGraph, setIsGraph] = useState(false);

  const [pretrainedModels, setPretrainedModels] = useState<Array<Model>>([]);

  const dispatchModelToStore = () => {
    if (!selectedModel) {
      process.env.NODE_ENV !== "production" &&
        console.warn("Attempting to dispatch undefined model");
      return;
    }

    dispatchFunction(selectedModel, inputShape);

    closeDialog();
  };

  const closeDialog = () => {
    onClose();
  };

  useHotkeys(
    "enter",
    () => dispatchModelToStore(),
    HotkeyView.ImportTensorflowModelDialog,
    { enableOnTags: ["INPUT"] },
    [dispatchModelToStore]
  );

  useEffect(() => {
    const allModels =
      modelTask === ModelTask.Classification
        ? availableClassifierModels
        : availableSegmenterModels;

    const _pretrainedModels = (allModels as Model[]).filter(
      (m) => m.pretrained
    );

    setPretrainedModels(_pretrainedModels);
  }, [modelTask]);

  return (
    <Dialog fullWidth maxWidth="xs" onClose={closeDialog} open={open}>
      <DialogTitle>
        Import{" "}
        {modelTask === ModelTask.Classification
          ? "Classification"
          : "Segmentation"}{" "}
        model
      </DialogTitle>

      <ModelFormatSelection isGraph={isGraph} setIsGraph={setIsGraph} />

      <LocalFileUpload
        modelTask={modelTask}
        isGraph={isGraph}
        setModel={setSelectedModel}
        setInputShape={setInputShape}
      />

      <PretrainedModelSelector
        values={pretrainedModels}
        setModel={setSelectedModel}
      />

      <CloudUpload
        modelTask={modelTask}
        isGraph={isGraph}
        setModel={setSelectedModel}
        setInputShape={setInputShape}
      />

      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>

        <Button
          onClick={dispatchModelToStore}
          color="primary"
          disabled={!selectedModel}
        >
          Open{" "}
          {modelTask === ModelTask.Classification
            ? "Classification"
            : "Segmentation"}{" "}
          model
        </Button>
      </DialogActions>
    </Dialog>
  );
};