import { Container, Typography } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { usePreferredNivoTheme } from "hooks/useTheme/usePreferredNivoTheme";

type TrainingHistoryPlotProps = {
  metric: string;
  trainingValues: { x: number; y: number }[];
  validationValues: { x: number; y: number }[];
  dynamicYRange?: boolean;
};

export const TrainingHistoryPlot = (props: TrainingHistoryPlotProps) => {
  const {
    metric,
    trainingValues,
    validationValues,
    dynamicYRange = false,
  } = props;

  const trainingData: any = {
    id: `${metric}`,
    color: "#DC3220",
    data: trainingValues,
  };

  const validationData: any = {
    id: `validation ${metric}`,
    color: "#005AB5",
    data: validationValues,
  };

  const min = dynamicYRange ? "auto" : 0;
  const max = dynamicYRange ? "auto" : 1;

  const nivoTheme = usePreferredNivoTheme();

  return (
    <Container sx={{ height: 350, mb: 5 }}>
      <Typography align={"center"} variant="body1">
        Training history - {metric} on epoch end
      </Typography>
      <ResponsiveLine
        data={[trainingData, validationData]}
        theme={nivoTheme}
        lineWidth={3}
        margin={{ top: 10, right: 150, bottom: 80, left: 70 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: min,
          max: max,
        }}
        yFormat=">-.3f"
        enableSlices={"x"}
        sliceTooltip={({ slice }) => {
          return (
            <div
              style={{
                background: "white",
                padding: "7px 7px",
              }}
            >
              {slice.points.map((point) => (
                <div
                  key={point.id}
                  style={{
                    color: point.serieColor,
                    padding: "3px 0",
                  }}
                >
                  <strong>{point.serieId}</strong> {point.data.yFormatted}
                </div>
              ))}
            </div>
          );
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "epochs",
          legendOffset: 30,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: `${metric}`,
          legendOffset: -50,
          legendPosition: "middle",
        }}
        colors={{ datum: "color" }}
        pointSize={8}
        pointColor={{ from: "color" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Container>
  );
};