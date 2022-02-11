import { ImageViewer } from "../../types/ImageViewer";
import { ImageType } from "../../types/ImageType";

export const imageAspectRatioSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewer;
}) => {
  if (!imageViewer.images.length) return;

  const image = imageViewer.images.find((image: ImageType) => {
    return image.id === imageViewer.activeImageId;
  });

  if (!image) return;

  return image.shape.height / image.shape.width;
};
