import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Project } from "types/Project";
import { defaultImageSortKey, ImageSortKeyType } from "types/ImageSortType";

export const initialState: Project = {
  selectedImageIds: [],
  name: "Untitled project",
  imageSortKey: defaultImageSortKey,
  highlightedCategory: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    resetProject: () => initialState,
    clearSelectedImages(state) {
      state.selectedImageIds = [];
    },
    deselectImage(state, action: PayloadAction<{ id: string }>) {
      state.selectedImageIds = state.selectedImageIds.filter(
        (id: string) => id !== action.payload.id
      );
    },
    deselectImages(state, action: PayloadAction<{ ids: Array<string> }>) {
      state.selectedImageIds = state.selectedImageIds.filter(
        (id: string) => !action.payload.ids.includes(id)
      );
    },
    selectAllImages(state, action: PayloadAction<{ ids: Array<string> }>) {
      state.selectedImageIds = [];

      state.selectedImageIds = action.payload.ids;
    },
    selectImage(state, action: PayloadAction<{ id: string }>) {
      state.selectedImageIds.push(action.payload.id);
    },
    selectOneImage(state, action: PayloadAction<{ id: string }>) {
      state.selectedImageIds = [];

      state.selectedImageIds.push(action.payload.id);
    },

    createNewProject(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
      state.imageSortKey = defaultImageSortKey;
    },
    setProject(state, action: PayloadAction<{ project: Project }>) {
      // WARNING, don't do below (overwrites draft object)
      // state = action.payload.project;
      return action.payload.project;
    },
    sortImagesBySelectedKey(
      state,
      action: PayloadAction<{ imageSortKey: ImageSortKeyType }>
    ) {
      const selectedSortKey = action.payload.imageSortKey;
      state.imageSortKey = selectedSortKey;

      //(state.images as OldImageType[]).sort(selectedSortKey.comparerFunction);
    },
    setProjectName(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
    },
    updateHighlightedCategory(
      state,
      action: PayloadAction<{ categoryIndex: number }>
    ) {
      // const index = action.payload.categoryIndex;
      // if (!isNaN(index) && index < state.categories.length) {
      //   const categoryId = state.categories[action.payload.categoryIndex].id;
      //   state.highlightedCategory = categoryId;
      // } else {
      //   state.highlightedCategory = null;
      // }
    },
  },
});

export const {
  createNewProject,
  deselectImage,
  deselectImages,
  updateHighlightedCategory,
} = projectSlice.actions;
