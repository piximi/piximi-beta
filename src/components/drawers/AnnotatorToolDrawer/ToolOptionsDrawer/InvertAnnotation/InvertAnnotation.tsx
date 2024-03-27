import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { List, SvgIcon } from "@mui/material";

import { useAnnotationToolNew, useTranslation } from "hooks";

import {
  imageViewerSlice,
  selectWorkingAnnotation,
} from "store/slices/imageViewer";

import { ReactComponent as InvertSelectionIcon } from "icons/InvertAnnotation.svg";
import { encode } from "utils/annotator";
import { CustomListItemButton } from "components/list-items/CustomListItemButton";
import { newDataSlice } from "store/slices/newData/newDataSlice";

//TODO: change to listItem

export const InvertAnnotation = () => {
  const dispatch = useDispatch();

  const { annotationTool } = useAnnotationToolNew();
  const workingAnnotationEntity = useSelector(selectWorkingAnnotation);

  const handleInvertClick = () => {
    if (!workingAnnotationEntity.saved) return;
    const workingAnnotation = {
      ...workingAnnotationEntity.saved,
      ...workingAnnotationEntity.changes,
    };
    if (!workingAnnotation.decodedMask) return;

    const [invertedMask, invertedBoundingBox] = annotationTool.invert(
      workingAnnotation.decodedMask,
      workingAnnotation.boundingBox
    );

    const encodedMask = encode(invertedMask);

    dispatch(
      newDataSlice.actions.updateThings({
        updates: [
          {
            id: workingAnnotation.id,
            encodedMask,
            boundingBox: invertedBoundingBox,
          },
        ],
      })
    );

    dispatch(
      imageViewerSlice.actions.setSelectedAnnotationIds({
        annotationIds: [workingAnnotation.id],
        workingAnnotationId: workingAnnotation.id,
      })
    );
  };

  const t = useTranslation();

  return (
    <List>
      <CustomListItemButton
        primaryText={t("Invert annotation")}
        onClick={handleInvertClick}
        icon={
          <SvgIcon>
            <InvertSelectionIcon />
          </SvgIcon>
        }
        dense
      />
    </List>
  );
};
