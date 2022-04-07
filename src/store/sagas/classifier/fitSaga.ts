import { put, select } from "redux-saga/effects";
import { compile, fit, open, preprocess } from "../../coroutines/classifier";
import { applicationSlice, classifierSlice, projectSlice } from "../../slices";
import {
  categorizedImagesSelector,
  compiledSelector,
  compileOptionsSelector,
  createdCategoriesCountSelector,
  createdCategoriesSelector,
  fitOptionsSelector,
  trainingPercentageSelector,
} from "../../selectors";
import { architectureOptionsSelector } from "../../selectors/architectureOptionsSelector";
import { rescaleOptionsSelector } from "../../selectors/rescaleOptionsSelector";
import { trainImagesSelector } from "../../selectors/trainImagesSelector";
import { valImagesSelector } from "../../selectors/valImagesSelector";
import * as tensorflow from "@tensorflow/tfjs";
import { RescaleOptions } from "../../../types/RescaleOptions";
import { ArchitectureOptions } from "../../../types/ArchitectureOptions";
import { CompileOptions } from "../../../types/CompileOptions";
import { Category } from "../../../types/Category";
import { ImageType } from "../../../types/ImageType";
import { FitOptions } from "../../../types/FitOptions";
import { ModelType } from "../../../types/ClassifierModelType";
import { AlertStateType, AlertType } from "types/AlertStateType";
import { getStackTraceFromError } from "utils/getStackTrace";
import _ from "lodash";
import { Partition } from "types/Partition";

export function* fitSaga(action: any): any {
  const { onEpochEnd } = action.payload;

  const trainingPercentage: number = yield select(trainingPercentageSelector);
  const categorizedImages: Array<ImageType> = yield select(
    categorizedImagesSelector
  );
  const fitOptions: FitOptions = yield fitOptionsSelector;

  //first assign train and val partition to all categorized images
  const categorizedImagesIds = (
    fitOptions.shuffle ? _.shuffle(categorizedImages) : categorizedImages
  ).map((image: ImageType) => {
    return image.id;
  });

  //separate ids into train and val datasets
  const trainDataLength = Math.round(
    trainingPercentage * categorizedImagesIds.length
  );
  const valDataLength = categorizedImagesIds.length - trainDataLength;

  const trainDataIds = _.take(categorizedImagesIds, trainDataLength);
  const valDataIds = _.takeRight(categorizedImagesIds, valDataLength);

  yield put(
    projectSlice.actions.updateImagesPartition({
      ids: trainDataIds,
      partition: Partition.Training,
    })
  );

  yield put(
    projectSlice.actions.updateImagesPartition({
      ids: valDataIds,
      partition: Partition.Validation,
    })
  );

  const architectureOptions: ArchitectureOptions = yield select(
    architectureOptionsSelector
  );
  const classes: number = yield select(createdCategoriesCountSelector);

  var model: tensorflow.LayersModel;
  if (architectureOptions.selectedModel.modelType === ModelType.UserUploaded) {
    model = yield select(compiledSelector);
  } else {
    try {
      model = yield open(architectureOptions, classes);
    } catch (error) {
      yield handleError(error as Error, "Failed to create tensorflow model");
      return;
    }
  }

  const compileOptions: CompileOptions = yield select(compileOptionsSelector);

  var compiledModel: tensorflow.LayersModel;
  try {
    compiledModel = yield compile(model, compileOptions);
  } catch (error) {
    yield handleError(error as Error, "Failed to compile tensorflow model");
    return;
  }

  yield put(
    classifierSlice.actions.updateCompiled({ compiled: compiledModel })
  );

  const categories: Category[] = yield select(createdCategoriesSelector);
  const trainImages: ImageType[] = yield select(trainImagesSelector);
  const valImages: ImageType[] = yield select(valImagesSelector);
  const rescaleOptions: RescaleOptions = yield select(rescaleOptionsSelector);

  try {
    const trainData: tensorflow.data.Dataset<{
      xs: tensorflow.Tensor<tensorflow.Rank.R4>;
      ys: tensorflow.Tensor<tensorflow.Rank.R2>;
      labels: tensorflow.Tensor<tensorflow.Rank.R1>;
      ids: tensorflow.Tensor<tensorflow.Rank.R1>;
    }> = yield preprocess(
      trainImages,
      categories,
      architectureOptions.inputShape,
      rescaleOptions,
      fitOptions,
      { numCrops: 1 }
    );

    const valData: tensorflow.data.Dataset<{
      xs: tensorflow.Tensor<tensorflow.Rank.R4>;
      ys: tensorflow.Tensor<tensorflow.Rank.R2>;
      labels: tensorflow.Tensor<tensorflow.Rank.R1>;
      ids: tensorflow.Tensor<tensorflow.Rank.R1>;
    }> = yield preprocess(
      valImages,
      categories,
      architectureOptions.inputShape,
      rescaleOptions,
      fitOptions,
      { numCrops: 1 }
    );

    var data = { train: trainData, val: valData };
  } catch (error) {
    process.env.NODE_ENV !== "production" && console.error(error);
    yield handleError(error as Error, "Error in preprocessing");
    return;
  }

  yield put(classifierSlice.actions.updatePreprocessed({ data: data }));

  try {
    var { fitted, status } = yield fit(
      compiledModel,
      data,
      fitOptions,
      onEpochEnd
    );
  } catch (error) {
    process.env.NODE_ENV !== "production" && console.error(error);
    yield handleError(error as Error, "Error in training the model");
    return;
  }

  const payload = { fitted: fitted, status: status };

  yield put(classifierSlice.actions.updateFitted(payload));
}

function* handleError(error: Error, errorName: string): any {
  const stackTrace = yield getStackTraceFromError(error);

  const alertState: AlertStateType = {
    alertType: AlertType.Error,
    name: errorName,
    description: `${error.name}:\n${error.message}`,
    stackTrace: stackTrace,
  };

  yield put(
    applicationSlice.actions.updateAlertState({
      alertState: alertState,
    })
  );

  yield put(
    classifierSlice.actions.updateFitting({
      fitting: false,
    })
  );
}
