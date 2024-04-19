import { Segmenter } from "./AbstractSegmenter";
import { Cellpose } from "./Cellpose";
import { CocoSSD } from "./CocoSSD";
import { FullyConvolutionalSegmenter } from "./FullyConvolutionalSegmenter";
import { StardistVHE } from "./StardistVHE";

export const availableSegmenterModels: Array<Segmenter> = [
  new FullyConvolutionalSegmenter(),
  new Cellpose(),
  new StardistVHE(),
  new CocoSSD(),
];