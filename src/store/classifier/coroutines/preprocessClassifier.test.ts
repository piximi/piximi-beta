import "@tensorflow/tfjs-node";
import {
  preprocessClassifier,
  createClassificationLabels,
} from "./preprocessClassifier";

import {
  Category,
  ImageType,
  Shape,
  RescaleOptions,
  FitOptions,
  PreprocessOptions,
  CropOptions,
  CropSchema,
} from "types";

import { loadImageFileAsStack, convertToImage } from "image/utils/imageHelper";
import { fileFromPath } from "image/utils/nodeImageHelper";

jest.setTimeout(50000);

const inputShape: Shape = {
  planes: 1,
  height: 224,
  width: 224,
  channels: 3,
};

const rescaleOptions: RescaleOptions = {
  rescale: true,
  center: false,
};

const cropOptions: CropOptions = {
  numCrops: 1,
  cropSchema: CropSchema.None,
};

const preprocessingOptions: PreprocessOptions = {
  shuffle: true,
  rescaleOptions,
  cropOptions,
};

const fitOptions: FitOptions = {
  epochs: 10,
  batchSize: 32,
  initialEpoch: 0,
};

const categories: Array<Category> = [
  {
    color: "",
    id: "00000000-0000-0000-0000-00000000001",
    name: "",
    visible: true,
  },
  {
    color: "",
    id: "00000000-0000-0000-0000-00000000002",
    name: "",
    visible: true,
  },
];

const preloadedImages = [
  { src: "https://picsum.photos/seed/piximi/224", name: "224.jpg" },
];

const urlToStack = async (src: string, name: string) => {
  const file = await fileFromPath(src, "image/png", true, "224.jpg");

  return loadImageFileAsStack(file);
};

it("preprocessClassifier", async () => {
  const images: Array<ImageType> = [];

  for (const preIm of preloadedImages) {
    const imStack = await urlToStack(preIm.src, preIm.name);
    const im = await convertToImage(
      imStack,
      preIm.name,
      undefined,
      1,
      imStack.length
    );
    images.push(im);
  }

  const imageLabels = createClassificationLabels(images, categories);

  const preprocessed = preprocessClassifier(
    images,
    imageLabels,
    inputShape,
    preprocessingOptions,
    fitOptions
  );

  // future warning: toArrayForTest is undocumented
  const items = await preprocessed.toArrayForTest();

  expect(items[0]["xs"].shape).toEqual([1, 224, 224, 3]);
  expect(items[0]["ys"].shape).toEqual([1, 2]);
});
