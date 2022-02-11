import React, { useRef } from "react";
import { ImageType } from "../../types/ImageType";
import { StyledMasksCanvas } from "./StyledImageCanvasComponents";

type LabelCanvasProps = {
  image: ImageType;
};

export const LabelCanvas = ({ image }: LabelCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.height = image.shape!.height;
      ref.current.width = image.shape!.width;
    }
  }, [image.shape]);

  return <StyledMasksCanvas ref={ref} />;
};
