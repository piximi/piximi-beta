import { History, LayersModel, Tensor } from "@tensorflow/tfjs";
import { LossFunction } from "./LossFunction";
import { Metric } from "./Metric";
import { OptimizationAlgorithm } from "./OptimizationAlgorithm";
import { FitOptions } from "./FitOptions";
import * as tensorflow from "@tensorflow/tfjs";
import { Shape } from "./Shape";
import { PreprocessOptions } from "./PreprocessOptions";
import { ClassifierModelProps } from "./ClassifierModelType";
import { EvaluationResultType } from "./EvaluationResultType";

export type Classifier = {
  compiled?: LayersModel;
  trainDataSet?: tensorflow.data.Dataset<{
    xs: tensorflow.Tensor;
    ys: tensorflow.Tensor;
    labels: tensorflow.Tensor;
    ids: tensorflow.Tensor;
  }>;
  valDataSet?: tensorflow.data.Dataset<{
    xs: tensorflow.Tensor;
    ys: tensorflow.Tensor;
    labels: tensorflow.Tensor;
    ids: tensorflow.Tensor;
  }>;
  evaluating: boolean;
  fitOptions: FitOptions;
  fitted?: LayersModel;
  fitting: boolean;
  inputShape: Shape;
  history?: History;
  learningRate: number;
  lossFunction:
    | LossFunction
    | Array<LossFunction>
    | { [outputName: string]: LossFunction };
  metrics: Array<Metric>;
  selectedModel: ClassifierModelProps;
  userUploadedModel?: ClassifierModelProps;
  optimizationAlgorithm: OptimizationAlgorithm;
  predicting: boolean;
  predictions?: Tensor;
  predicted: boolean;
  trainingPercentage: number;
  evaluationResult: EvaluationResultType;
  preprocessOptions: PreprocessOptions;
};
