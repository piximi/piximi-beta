import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Container, Grid } from "@mui/material";

import { useDialogHotkey } from "hooks";

import { projectSlice } from "store/project";

import { HotkeyView } from "utils/common/enums";
import { imageViewerSlice } from "store/imageViewer";
import { DialogWithAction } from "components/dialogs";
import { selectThingsOfKind } from "store/data";
import { ProjectGridItem } from "../ProjectGridItem";
import { useSortFunction } from "hooks/useSortFunction/useSortFunction";
import { GridItemActionBar } from "components/app-bars";
import { DropBox } from "components/styled-components/DropBox/DropBox";
import {
  selectActiveKindId,
  selectThingFilters,
} from "store/project/selectors";
import { isFiltered } from "utils/common/helpers";
import { dataSlice } from "store/data/dataSlice";
import { selectActiveSelectedThingIds } from "store/project/reselectors";
import { AnnotationObject, ImageObject } from "store/data/types";

const max_images = 1000; //number of images from the project that we'll show

//NOTE: kind is passed as a prop and used internally instead of the kind returned
// by the active kind selector to keep from rerendering the grid items when switching tabs

export const ImageGrid = ({ kind }: { kind: string }) => {
  const dispatch = useDispatch();
  const activeKind = useSelector(selectActiveKindId);
  const things = useSelector(selectThingsOfKind)(kind);
  const thingFilters = useSelector(selectThingFilters)[kind];
  const selectedThingIds = useSelector(selectActiveSelectedThingIds);
  const sortFunction = useSortFunction();

  //const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();

  const {
    onClose: handleCloseDeleteImagesDialog,
    onOpen: onOpenDeleteImagesDialog,
    open: deleteImagesDialogisOpen,
  } = useDialogHotkey(HotkeyView.DialogWithAction);

  const handleSelectAll = useCallback(() => {
    dispatch(
      projectSlice.actions.selectThings({
        ids: things.map((thing) => thing.id),
      })
    );
  }, [things, dispatch]);

  const handleDeselectAll = () => {
    dispatch(
      projectSlice.actions.deselectThings({
        ids: things.map((thing) => thing.id),
      })
    );
  };

  const handleDelete = () => {
    dispatch(
      dataSlice.actions.deleteThings({
        thingIds: selectedThingIds,
        disposeColorTensors: true,
        isPermanent: true,
      })
    );
  };

  const handleSelectThing = useCallback(
    (id: string, selected: boolean) => {
      if (selected) {
        dispatch(projectSlice.actions.deselectThings({ ids: id }));
      } else {
        dispatch(projectSlice.actions.selectThings({ ids: id }));
      }
    },
    [dispatch]
  );

  const handleOpenImageViewer = () => {
    dispatch(imageViewerSlice.actions.prepareImageViewer({ selectedThingIds }));
  };

  //   useHotkeys("esc", () => handleDeselectAll(), HotkeyView.ProjectView, {
  //     enabled: tabIndex === 0,
  //   });
  //   useHotkeys(
  //     "backspace, delete",
  //     () => onOpenDeleteImagesDialog(),
  //     HotkeyView.ProjectView,
  //     { enabled: tabIndex === 0 }
  //   );
  //   useHotkeys(
  //     "control+a",
  //     () => handleSelectAll(),
  //     HotkeyView.ProjectView,
  //     { enabled: tabIndex === 0 },
  //     [images]
  //   );

  return (
    <DropBox>
      <>
        <Container
          sx={(theme) => ({
            paddingBottom: theme.spacing(8),
            height: "100%",
            overflowY: "scroll",
          })}
          maxWidth={false}
        >
          <div
            onClick={() => {
              dispatch(
                projectSlice.actions.deselectThings({ ids: selectedThingIds })
              );
            }}
          >
            <Grid
              container
              gap={2}
              sx={{
                transform: "translateZ(0)",
                height: "100%",
                overflowY: "scroll",
              }}
            >
              {things
                .slice(0, max_images)
                .sort(sortFunction)
                .map((thing: ImageObject | AnnotationObject) => (
                  <ProjectGridItem
                    key={thing.id}
                    thing={thing}
                    handleClick={handleSelectThing}
                    selected={selectedThingIds.includes(thing.id)}
                    filtered={isFiltered(thing, thingFilters ?? {})}
                  />
                ))}
            </Grid>

            {/*<ImageCategoryMenu
            open={contextMenu !== null}
            onClose={closeContextMenu}
            anchorReference="anchorPosition"
            imageIds={selectedImageIds}
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          />*/}
          </div>
        </Container>
        {kind === activeKind && (
          <GridItemActionBar
            allSelected={selectedThingIds.length === things.length}
            selectedThings={selectedThingIds}
            selectAllThings={handleSelectAll}
            deselectAllThings={handleDeselectAll}
            handleOpenDeleteDialog={onOpenDeleteImagesDialog}
            onOpenImageViewer={handleOpenImageViewer}
          />
        )}

        <DialogWithAction
          title={`Delete ${selectedThingIds.length} Object${
            selectedThingIds.length > 1 ? "s" : ""
          }?`}
          content={`Objects will be deleted from the project. ${
            kind === "Image"
              ? "Associated annotations will also be removed."
              : ""
          } `}
          onConfirm={handleDelete}
          isOpen={deleteImagesDialogisOpen}
          onClose={handleCloseDeleteImagesDialog}
        />
      </>
    </DropBox>
  );
};
