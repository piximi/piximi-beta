import { useLayoutEffect, useState } from "react";
import * as ReactKonva from "react-konva";

import { ColorAnnotationToolTip } from "../../ColorAnnotationToolTip";

import { ColorAnnotationTool } from "annotator-tools";
import { useImageOrigin } from "hooks";

type ColorSelectionProps = {
  operator: ColorAnnotationTool;
};

export const ColorSelection = ({ operator }: ColorSelectionProps) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const imagePosition = useImageOrigin();

  useLayoutEffect(() => {
    let timerId: number;
    const f = () => {
      timerId = requestAnimationFrame(f);
      const image = new Image();
      image.src = operator.overlayData;
      setImage(image);
    };

    timerId = requestAnimationFrame(f);

    return () => cancelAnimationFrame(timerId);
  });

  if (!operator.overlayData || !operator.offset) return null;

  return (
    <>
      <ReactKonva.Group>
        <ReactKonva.Image
          image={image}
          x={imagePosition.x}
          y={imagePosition.y}
        />
      </ReactKonva.Group>
      <ColorAnnotationToolTip
        toolTipPosition={{
          x: operator.toolTipPosition!.x + imagePosition.x,
          y: operator.toolTipPosition!.y + imagePosition.y,
        }}
        initialPosition={operator.origin}
        imageOrigin={imagePosition}
        tolerance={operator.tolerance}
      />
    </>
  );
};
