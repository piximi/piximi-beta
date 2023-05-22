import React, { useContext } from "react";
import { useSelector } from "react-redux";
import * as ReactKonva from "react-konva";

import { useMarchingAnts } from "hooks";

import { StageContext } from "components/annotator/AnnotatorView/AnnotatorView";
import { imageOriginSelector } from "store/imageViewer";
import { LassoAnnotationTool } from "annotator-tools";

type LassoSelectionProps = {
  operator: LassoAnnotationTool;
};

export const LassoSelection = ({ operator }: LassoSelectionProps) => {
  const dashOffset = useMarchingAnts();
  const imageOrigin = useSelector(imageOriginSelector);
  const stageScale = useContext(StageContext)?.current?.scaleX() ?? 1;
  if (!operator.origin) return <></>;

  return (
    <>
      <ReactKonva.Group>
        <ReactKonva.Circle
          fill="white"
          radius={3 / stageScale}
          stroke="black"
          strokeWidth={1 / stageScale}
          x={operator.origin.x + imageOrigin.x}
          y={operator.origin.y + imageOrigin.y}
        />

        {operator.anchor && (
          <>
            <ReactKonva.Circle
              fill="black"
              radius={3 / stageScale}
              stroke="white"
              strokeWidth={1 / stageScale}
              x={operator.anchor.x + imageOrigin.x}
              y={operator.anchor.y + imageOrigin.y}
            />
          </>
        )}
        <ReactKonva.Line
          points={operator.buffer.flatMap((point) => [
            point.x + imageOrigin.x,
            point.y + imageOrigin.y,
          ])}
          stroke="black"
          strokeWidth={1 / stageScale}
        />
        <ReactKonva.Line
          dash={[4 / stageScale, 2 / stageScale]}
          dashOffset={-dashOffset}
          stroke="white"
          points={operator.buffer.flatMap((point) => [
            point.x + imageOrigin.x,
            point.y + imageOrigin.y,
          ])}
          strokeWidth={1 / stageScale}
        />
      </ReactKonva.Group>
    </>
  );
};
