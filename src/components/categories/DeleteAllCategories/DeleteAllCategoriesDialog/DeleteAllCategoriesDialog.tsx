import React from "react";
import { batch, useDispatch } from "react-redux";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useHotkeys } from "hooks";

import { AnnotatorSlice } from "store/annotator";
import { DataSlice } from "store/data";

import {
  CategoryType,
  HotkeyView,
  UNKNOWN_ANNOTATION_CATEGORY_ID,
} from "types";
import { unregisterHotkeyView } from "store/application";

type DeleteAllCategoriesDialogProps = {
  categoryType: CategoryType;
  onClose: () => void;
  open: boolean;
};

export const DeleteAllCategoriesDialog = ({
  categoryType,
  onClose,
  open,
}: DeleteAllCategoriesDialogProps) => {
  const dispatch = useDispatch();

  const onDeleteAllCategories = () => {
    if (categoryType === CategoryType.ClassifierCategory) {
      deleteAllClassifierCategories();
    } else {
      deleteAllAnnotationCategories();
    }
    dispatch(unregisterHotkeyView(HotkeyView.DeleteAllCategoriesDialog));
  };

  const deleteAllClassifierCategories = () => {
    dispatch(DataSlice.actions.deleteAllCategories({}));
  };

  const deleteAllAnnotationCategories = () => {
    batch(() => {
      dispatch(
        AnnotatorSlice.actions.setSelectedCategoryId({
          selectedCategoryId: UNKNOWN_ANNOTATION_CATEGORY_ID,
          execSaga: true,
        })
      );

      dispatch(DataSlice.actions.deleteAllAnnotationCategories({}));
    });
  };

  useHotkeys(
    "enter",
    () => {
      onDeleteAllCategories();
    },
    HotkeyView.DeleteAllCategoriesDialog,
    { enableOnTags: ["INPUT"] },
    [onDeleteAllCategories]
  );

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogTitle>Delete all categories?</DialogTitle>

      <DialogContent>
        {categoryType === CategoryType.ClassifierCategory
          ? "Images"
          : "Annotations"}{" "}
        will not be deleted and instead will be labeled as "Unknown".
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={onDeleteAllCategories} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
