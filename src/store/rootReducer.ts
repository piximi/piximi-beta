import { combineReducers } from "redux";
import { applicationSettingsSlice } from "store/applicationSettings";
import { classifierSlice } from "store/classifier";
import { imageViewerSlice } from "store/imageViewer";
import { projectSlice } from "store/project";
import { segmenterSlice } from "store/segmenter";
import { annotatorSlice } from "store/annotator";
import { dataSlice } from "./data/dataSlice";

const reducers = {
  classifier: classifierSlice.reducer,
  segmenter: segmenterSlice.reducer,
  imageViewer: imageViewerSlice.reducer,
  project: projectSlice.reducer,
  applicationSettings: applicationSettingsSlice.reducer,
  annotator: annotatorSlice.reducer,
  newData: dataSlice.reducer,
};

export const rootReducer = combineReducers(reducers);
export type RootState = ReturnType<typeof rootReducer>;