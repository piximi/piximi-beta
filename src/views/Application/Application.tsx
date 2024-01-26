import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

import { usePreferredMuiTheme } from "hooks";

import { ImageViewer } from "../ImageViewer";
import { ProjectViewer } from "../ProjectViewer";
import { NewProjectViewer } from "views/ProjectViewer/NewProjectViewer";

export const Application = () => {
  const theme = usePreferredMuiTheme();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={"/"}>
          <Routes>
            <Route path="/" element={<ProjectViewer />} />
            <Route path="annotator" element={<ImageViewer />} />
            <Route path="newUI" element={<NewProjectViewer />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
