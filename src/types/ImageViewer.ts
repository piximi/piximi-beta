import { ToolType } from "./ToolType";
import { AnnotationModeType } from "./AnnotationModeType";
import { LanguageType } from "./LanguageType";
import { AnnotationType } from "./AnnotationType";
import { AnnotationStateType } from "./AnnotationStateType";
import { Color } from "./Color";
import { ShadowImageType } from "./ImageType";
import { Category } from "./Category";

export type ImageViewer = {
  annotationState: AnnotationStateType;
  boundingClientRect: DOMRect;
  brightness: number;
  categories: Array<Category>;
  currentColors: Array<Color> | undefined;
  contrast: number;
  currentIndex: number;
  currentPosition?: { x: number; y: number };
  cursor: string;
  exposure: number;
  hue: number;
  activeImageId?: string;
  activeImageRenderedSrcs: Array<string>;
  images: Array<ShadowImageType>;
  language: LanguageType;
  offset: { x: number; y: number };
  penSelectionBrushSize: number;
  pointerSelection: {
    dragging: boolean;
    selecting: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
  };
  quickSelectionBrushSize: number;
  saturation: number;
  selectedAnnotations: Array<AnnotationType>;
  selectedAnnotation: AnnotationType | undefined;
  selectedCategoryId: string;
  selectionMode: AnnotationModeType;
  soundEnabled: boolean;
  stageHeight: number;
  stageScale: number;
  stageWidth: number;
  stagePosition: { x: number; y: number };
  toolType: ToolType;
  vibrance: number;
  zoomSelection: {
    dragging: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
    selecting: boolean;
  };
};
