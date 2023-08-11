import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import { classifierSelector } from "store/classifier";
import { projectSelector, projectSlice } from "store/project";
import { dataProjectSelector } from "store/data";
// TODO: implement segmenter serialization
// import { segmenterSelector } from "store/segmenter";

import { AlertStateType, AlertType, HotkeyView } from "types";
import { useDebounce, useHotkeys } from "hooks";
import { serialize } from "utils/common/image/serialize";
import { segmenterSelector } from "store/segmenter";
import { saveAs } from "file-saver";
import { applicationSlice } from "store/application";

type SaveProjectDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const SaveProjectDialog = ({
  onClose,
  open,
}: SaveProjectDialogProps) => {
  const dispatch = useDispatch();

  const classifier = useSelector(classifierSelector);
  const segmenter = useSelector(segmenterSelector);

  const project = useSelector(projectSelector);
  const data = useSelector(dataProjectSelector);

  const [projectName, setProjectName] = useState<string>(project.name);

  const onLoadProgress = useDebounce((loadPercent: number) => {
    dispatch(projectSlice.actions.setLoadPercent({ loadPercent }));
  }, 10);

  const onSaveProjectClick = async () => {
    serialize(projectName, project, data, classifier, segmenter, onLoadProgress)
      .then((zip) => {
        return zip.generateAsync(
          {
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 4 },
          },
          // onUpdate callback
          (meta: { percent: number }) => {
            onLoadProgress(meta.percent / 100);
            process.env.REACT_APP_LOG_LEVEL === "1" &&
              console.log(`zipping %${Math.floor(meta.percent)}`);
          }
        );
      })
      .then((blob) => {
        onLoadProgress(-1);
        saveAs(blob, `${projectName}.zip`);
        onLoadProgress(1);
      })
      .catch((err: Error) => {
        process.env.REACT_APP_LOG_LEVEL === "1" && console.error(err);

        process.env.NODE_ENV !== "production" &&
          process.env.REACT_APP_LOG_LEVEL === "1" &&
          console.error(err);
        const warning: AlertStateType = {
          alertType: AlertType.Warning,
          name: "Could not parse project file",
          description: `Error while parsing the project file: ${err.name}\n${err.message}`,
        };

        dispatch(
          applicationSlice.actions.updateAlertState({ alertState: warning })
        );
      });

    onClose();
  };

  const onCancel = () => {
    onClose();
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  useHotkeys(
    "enter",
    () => {
      onSaveProjectClick();
    },
    HotkeyView.SaveProjectDialog,
    { enableOnTags: ["INPUT"] },
    [onSaveProjectClick]
  );

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>Save Project</DialogTitle>

      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <TextField
              autoFocus
              fullWidth
              id="name"
              label="Project file name"
              margin="dense"
              value={projectName}
              onChange={onNameChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>

        <Button onClick={onSaveProjectClick} color="primary">
          Save Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};
