import React from "react";
import { batch, useDispatch } from "react-redux";

import { ListItemText, MenuItem } from "@mui/material";

import { applicationSlice } from "store/application";
import { classifierSlice } from "store/classifier";
import { projectSlice } from "store/project";
import { segmenterSlice } from "store/segmenter";

import { deserialize } from "utils/common/image/deserialize";

import { AlertStateType, AlertType } from "types";
import { imageViewerSlice } from "store/imageViewer";
import { dataSlice } from "store/data";
import { fListToStore } from "utils/annotator/file-io/zarr";

type OpenProjectMenuItemProps = {
  onMenuClose: () => void;
  fromAnnotator?: boolean;
};

export const OpenProjectMenuItem = ({
  onMenuClose,
  fromAnnotator = false,
}: OpenProjectMenuItemProps) => {
  const dispatch = useDispatch();

  const onOpenProject = async (
    event: React.ChangeEvent<HTMLInputElement>,
    zip: boolean
  ) => {
    event.persist();

    if (!event.currentTarget.files) return;

    const files = event.currentTarget.files;

    const zarrStore = await fListToStore(files, zip);

    deserialize(zarrStore)
      .then((res) => {
        batch(() => {
          dispatch(classifierSlice.actions.resetClassifier());
          dispatch(segmenterSlice.actions.resetSegmenter());
          dispatch(imageViewerSlice.actions.resetImageViewer());
          dispatch(projectSlice.actions.resetProject());

          dispatch(
            dataSlice.actions.initData({
              images: res.data.images,
              annotations: res.data.annotations,
              categories: res.data.categories,
              annotationCategories: res.data.annotationCategories,
            })
          );
          dispatch(
            projectSlice.actions.setProject({
              project: res.project,
            })
          );

          dispatch(
            classifierSlice.actions.setClassifier({
              classifier: res.classifier,
            })
          );

          dispatch(
            segmenterSlice.actions.setSegmenter({
              segmenter: res.segmenter,
            })
          );
        });

        if (fromAnnotator) {
          batch(() => {
            dispatch(
              imageViewerSlice.actions.setActiveImageId({
                imageId: res.data.images[0].id,
                prevImageId: undefined,
                execSaga: true,
              })
            );
          });
        }
      })
      .catch((err) => {
        const error: Error = err as Error;
        process.env.NODE_ENV !== "production" &&
          process.env.REACT_APP_LOG_LEVEL === "1" &&
          console.error(err);
        const warning: AlertStateType = {
          alertType: AlertType.Warning,
          name: "Could not parse project file",
          description: `Error while parsing the project file: ${error.name}\n${error.message}`,
        };
        dispatch(
          applicationSlice.actions.updateAlertState({ alertState: warning })
        );
      });

    event.target.value = "";
  };

  return (
    <>
      <MenuItem component="label">
        <ListItemText primary="Open project zarr" />
        <input
          accept=".zarr"
          hidden
          id="open-project-zarr"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onMenuClose();
            onOpenProject(event, false);
          }}
          type="file"
          // @ts-ignore
          webkitdirectory=""
        />
      </MenuItem>
      <MenuItem component="label">
        <ListItemText primary="Open project zip" />
        <input
          accept="application/zip"
          hidden
          id="open-project-zip"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onMenuClose();
            onOpenProject(event, true);
          }}
          type="file"
        />
      </MenuItem>
    </>
  );
};
