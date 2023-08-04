import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";

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
import { projectSelector } from "store/project";
import { dataProjectSelector } from "store/data";
// TODO: implement segmenter serialization
// import { segmenterSelector } from "store/segmenter";

import { HotkeyView } from "types";
import { useHotkeys } from "hooks";
import { serialize } from "utils/common/image/serialize";
import { segmenterSelector } from "store/segmenter";
import { saveAs } from "file-saver";

type SaveProjectDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const SaveProjectDialog = ({
  onClose,
  open,
}: SaveProjectDialogProps) => {
  const classifier = useSelector(classifierSelector);
  const segmenter = useSelector(segmenterSelector);

  const project = useSelector(projectSelector);
  const data = useSelector(dataProjectSelector);

  const [projectName, setProjectName] = useState<string>(project.name);

  const onSaveProjectClick = async () => {
    serialize(projectName, project, data, classifier, segmenter)
      .then((zip) => {
        return zip.generateAsync(
          {
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 4 },
          },
          // onUpdate callback
          (meta: { percent: number }) => {
            process.env.REACT_APP_LOG_LEVEL === "1" &&
              console.log(`zipping %${Math.floor(meta.percent)}`);
          }
        );
      })
      .then((blob) => {
        saveAs(blob, `${projectName}.zip`);
      })
      .catch((err) => {
        process.env.REACT_APP_LOG_LEVEL === "1" && console.error(err);
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
