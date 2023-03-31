import { createSelector } from "@reduxjs/toolkit";
import { selectedImagesIdSelector } from "store/project";
import { DataStoreSlice, ImageType, Partition } from "types";

import { selectVisibleCategoryIds } from "./imageCategorySelectors";
import { mutatingFilter } from "utils/common/helpers";

export const selectImageCount = ({ data }: { data: DataStoreSlice }) => {
  return data.images.ids.length;
};
export const selectImagesByCategory =
  (categoryId: string) =>
  ({ data }: { data: DataStoreSlice }) => {
    return data.imagesByCategory[categoryId] ?? [];
  };
export const selectInferenceImages = ({ data }: { data: DataStoreSlice }) => {
  return Object.values(data.images.entities).filter(
    (image) => image.partition === Partition.Inference
  );
};
export const selectSegmenterTrainingImages = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return Object.values(data.images.entities).filter(
    (image) => image.partition === Partition.Training
  );
};
export const selectSegmenterValidationImages = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return Object.values(data.images.entities).filter(
    (image) => image.partition === Partition.Validation
  );
};
export const selectTrainingImages = ({ data }: { data: DataStoreSlice }) => {
  return Object.values(data.images.entities).filter(
    (image) => image.partition === Partition.Training
  );
};
export const selectUnannotatedImages = ({ data }: { data: DataStoreSlice }) => {
  const images = [];
  for (const imageId in data.annotationsByImage) {
    if (!data.annotationsByImage[imageId].length) {
      images.push(data.images.entities[imageId]);
    }
  }

  return images;
};
export const selectValidationImages = ({ data }: { data: DataStoreSlice }) => {
  return Object.values(data.images.entities).filter(
    (image) => image.partition === Partition.Validation
  );
};

export const selectStagedImageEntities = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return data.stagedImages.entities;
};
export const selectImageCountByCategory =
  (categoryId: string) =>
  ({ data }: { data: DataStoreSlice }) => {
    return data.imagesByCategory[categoryId]?.length;
  };

export const selectImageEntities = ({ data }: { data: DataStoreSlice }) => {
  return data.images.entities;
};
export const selectImageViewerImageEntities = createSelector(
  [selectImageEntities, selectStagedImageEntities],
  (imageEntities, stagegedImageEntities) => {
    const viewerEntities: typeof imageEntities = {};
    const stagedIds = Object.keys(stagegedImageEntities);
    for (const imageId in imageEntities) {
      if (
        stagegedImageEntities[imageId] &&
        !stagegedImageEntities[imageId]!.deleted
      ) {
        mutatingFilter(stagedIds, (stagedId) => stagedId !== imageId);
        continue;
      }
      viewerEntities[imageId] = {
        ...imageEntities[imageId],
        ...stagegedImageEntities[imageId],
      };
      mutatingFilter(stagedIds, (stagedId) => stagedId !== imageId);
    }
    for (const stagedId of stagedIds) {
      viewerEntities[stagedId] = stagegedImageEntities[stagedId] as ImageType;
    }
    return viewerEntities;
  }
);
export const selectImageById = createSelector(
  [
    selectImageViewerImageEntities,
    (state, imageId) => {
      return imageId;
    },
  ],
  (imageEntities, imageId) => {
    return imageEntities[imageId];
  }
);
export const selectAllImages = ({ data }: { data: DataStoreSlice }) => {
  return Object.values(data.images.entities);
};

export const selectSelectedImages = createSelector(
  [selectedImagesIdSelector, selectImageEntities],
  (imageIds, imageEntities) => {
    return imageIds.map((imageId) => imageEntities[imageId]);
  }
);

// reselects on projectSlice.selectedImages, dataSlice.images.entities, and dataSlice.stagedImages.entities
export const selectImageViewerImages = createSelector(
  [selectedImagesIdSelector, selectImageEntities, selectStagedImageEntities],
  (imageIds, imageEntities, stagedImageEntities) => {
    let returnedImages = imageIds.map((imageId) => {
      return { ...imageEntities[imageId], ...stagedImageEntities[imageId] };
    });
    console.log("~* selectImageViewerImages *~");
    console.log(" --- selectedImageIds: ", imageIds);
    console.log(" --- imageEntities: ", imageEntities);
    console.log(" --- stagedImageEntities: ", stagedImageEntities);
    console.log(" --- returnedImages: ", returnedImages);
    console.log(" ");

    return returnedImages;
  }
);
export const selectImagesByCategoryEntity = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return data.imagesByCategory;
};

export const selectVisibleImages = createSelector(
  [
    selectVisibleCategoryIds,
    selectImagesByCategoryEntity,
    selectImageEntities,
    selectStagedImageEntities,
  ],
  (imageCategories, imagesByCategory, imageEntities, stagedImageEntities) => {
    const visibleImages: ImageType[] = [];
    for (const categoryId of imageCategories) {
      console.log(categoryId);
      for (const imageId of imagesByCategory[categoryId]) {
        const combinedImage = {
          ...imageEntities[imageId],
          ...stagedImageEntities[imageId],
        };
        if (combinedImage.visible) {
          visibleImages.push(combinedImage);
        }
      }
    }
    return visibleImages;
  }
);

//TODO: reselect
export const selectAnnotatedImages = ({ data }: { data: DataStoreSlice }) => {
  const images = [];
  for (const imageId in data.annotationsByImage) {
    if (data.annotationsByImage[imageId].length) {
      images.push(data.images.entities[imageId]);
    }
  }

  return images;
};
