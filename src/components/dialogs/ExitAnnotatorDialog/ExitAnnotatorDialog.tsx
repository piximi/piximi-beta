import { batch, useDispatch, useSelector } from "react-redux";
import { DialogWithAction } from "../DialogWithAction";
import { imageViewerSlice } from "store/imageViewer";
import { dataSlice } from "store/data/dataSlice";
import { selectActiveImageId } from "store/imageViewer/selectors";
import {
  selectActiveAnnotations,
  selectActiveImage,
  selectImageViewerActiveKindsWithFullCat,
} from "store/imageViewer/reselectors";
import { sendAnnotations } from "utils/imjoy/hypha";

type ExitAnnotatorDialogProps = {
  onReturnToProject: () => void;
  onClose: () => void;
  open: boolean;
};

export const ExitAnnotatorDialog = ({
  onReturnToProject,
  onClose,
  open,
}: ExitAnnotatorDialogProps) => {
  const dispatch = useDispatch();

  const activeImage = useSelector(selectActiveImage);
  const activeImageId = useSelector(selectActiveImageId);
  const activeImageAnnotations = useSelector(selectActiveAnnotations);
  const activeKindsWithCats = useSelector(
    selectImageViewerActiveKindsWithFullCat
  );

  const onSaveChanges = () => {
    batch(() => {
      dispatch(
        imageViewerSlice.actions.setActiveImageId({
          imageId: undefined,
          prevImageId: activeImageId,
        })
      );
      dispatch(dataSlice.actions.reconcile({ keepChanges: true }));
      dispatch(imageViewerSlice.actions.setImageStack({ imageIds: [] }));
    });

    if (activeImage) {
      sendAnnotations(
        activeImage.shape,
        activeImageAnnotations,
        activeKindsWithCats
      );
    }

    onReturnToProject();
  };

  const onDiscardChanges = () => {
    batch(() => {
      dispatch(
        imageViewerSlice.actions.setActiveImageId({
          imageId: undefined,
          prevImageId: activeImageId,
        })
      );
      dispatch(dataSlice.actions.reconcile({ keepChanges: false }));
    });

    onReturnToProject();
  };

  return (
    <DialogWithAction
      title="Save Changes?"
      content="Would you like to save the changes to these annotations and return to the project page?"
      onConfirm={onSaveChanges}
      confirmText="SAVE"
      onReject={onDiscardChanges}
      rejectText="DISCARD"
      onClose={onClose}
      isOpen={open}
    />
  );
};
