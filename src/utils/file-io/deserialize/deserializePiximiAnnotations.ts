import { deserializePiximiAnnotations_v1 } from "./v1/deserializePiximiAnnotations_v1";
import { deserializePiximiAnnotations_v2 } from "./v2/deserializePiximiAnnotations_v2";
import { convertAnnotationsWithExistingProject_v1_2 } from "utils/file-io/converters/dataConverter_v1v2";
import { logger } from "utils/common/helpers";
import { SerializedFileType, SerializedFileTypeV2 } from "../types";
import { Kind, Category, ImageObject } from "store/data/types";

export const deserializePiximiAnnotations = async (
  serializedAnnotations: SerializedFileTypeV2 | SerializedFileType,
  existingImages: Record<string, ImageObject>,
  existingCategories: Record<string, Category>,
  existingKinds: Record<string, Kind>
) => {
  if (!("version" in serializedAnnotations)) {
    const { annotations, newCategories } = deserializePiximiAnnotations_v1(
      serializedAnnotations as SerializedFileType,
      Object.values(existingImages),
      Object.values(existingCategories)
    );
    const convertedData = await convertAnnotationsWithExistingProject_v1_2(
      existingImages,
      existingKinds,
      annotations,
      newCategories
    );
    return convertedData;
  }
  switch (serializedAnnotations.version) {
    case "0.2.0": {
      const { annotations, newCategories, newKinds } =
        await deserializePiximiAnnotations_v2(
          serializedAnnotations as SerializedFileTypeV2,
          Object.values(existingImages),
          Object.values(existingCategories),
          Object.values(existingKinds)
        );
      return { newAnnotations: annotations, newCategories, newKinds };
    }
    default:
      logger(`Unrecognized Piximi version: ${serializedAnnotations.version}`);
      return { newAnnotations: [], newCategories: [], newKinds: [] };
  }
};
