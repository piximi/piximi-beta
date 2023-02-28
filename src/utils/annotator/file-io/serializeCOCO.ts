import {
  decode,
  padMask,
  findContours,
  simplifyPolygon,
} from "utils/annotator";
import {
  Category,
  SerializedCOCOAnnotationType,
  SerializedCOCOCategoryType,
  SerializedCOCOFileType,
  SerializedCOCOImageType,
  ShadowImageType,
} from "types";

export const serializeCOCOFile = (
  images: Array<ShadowImageType>,
  categories: Array<Category>
): SerializedCOCOFileType => {
  let imCount = 0;
  let catCount = 0;
  let annCount = 0;

  const imIdMap = images.reduce((idMap, im) => {
    idMap[im.id] = {
      id: imCount++,
      width: im.shape.width,
      height: im.shape.height,
      file_name: im.name,
      license: 0,
      flickr_url: "",
      coco_url: "",
      date_captured: "",
    };
    return idMap;
  }, {} as { [internalImageId: string]: SerializedCOCOImageType });

  const catIdMap = categories.reduce((idMap, cat) => {
    idMap[cat.id] = {
      id: catCount++,
      name: cat.name,
      supercategory: cat.name,
    };
    return idMap;
  }, {} as { [internalCategoryId: string]: SerializedCOCOCategoryType });

  let serializedAnnotations: Array<SerializedCOCOAnnotationType> = [];

  for (const im of images) {
    for (const ann of im.annotations) {
      const boxWidth = ann.boundingBox[2] - ann.boundingBox[0];
      const boxHeight = ann.boundingBox[3] - ann.boundingBox[1];

      const paddedMask = padMask(decode(ann.mask), boxWidth, boxHeight);
      // +2 to W, H to account for padding on mask
      const contours = findContours(paddedMask, boxWidth + 2, boxHeight + 2);
      const outerBorder = contours.find((b) => b.seqNum === 2);

      if (!outerBorder) {
        process.env.NODE_ENV !== "production" &&
          console.log(`Could not find outer border of annotation ${ann.id}`);
        throw new Error(
          `Could not determine contours of annotation belonging to image ${im.name}`
        );
      }

      const SIMPLIFY = false;

      // coco polygon points are arranged as: [x_1, y_1, x_2, y_2, ...]
      const outerBorderPoints = (
        SIMPLIFY ? simplifyPolygon(outerBorder.points) : outerBorder.points
      )
        // add x_1, y_1 coordinates of box to translate polygon
        // points to wrt to image, rather than wrt mask
        .map((p) => [p.x + ann.boundingBox[0], p.y + ann.boundingBox[1]])
        .flat();

      serializedAnnotations.push({
        id: annCount++,
        image_id: imIdMap[im.id].id,
        category_id: catIdMap[ann.categoryId].id,
        segmentation: [outerBorderPoints],
        area: 0,
        // x1, y1, width, height
        bbox: [ann.boundingBox[0], ann.boundingBox[1], boxWidth, boxHeight],
        iscrowd: 0,
      });
    }
  }

  const info = {
    year: new Date().getFullYear(),
    // TODO: COCO - get this from package.json
    version: "0.1.0",
    description: "",
    contributor: "",
    url: "",
    date_created: "",
  };

  const licenses = [
    {
      id: 0,
      name: "",
      url: "",
    },
  ];

  return {
    info,
    images: Object.values(imIdMap),
    categories: Object.values(catIdMap),
    annotations: serializedAnnotations,
    licenses,
  };
};