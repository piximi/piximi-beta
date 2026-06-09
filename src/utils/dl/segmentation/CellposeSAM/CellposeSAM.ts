import { Cellpose as CellposeJs, configureOrt } from "cellpose-js";

import { logger } from "utils/logUtils";
import type { LoadCB } from "utils/types";

import { Segmenter } from "../AbstractSegmenter/AbstractSegmenter";
import { predictCellposeSAM } from "./predictCellposeSAM";
import { ModelTask } from "../../enums";
import { channelsToTensor } from "../../tensor-assembly";

import type { PredictedAnnotationObject } from "../types";
import type { InferenceInput } from "../../types";
import type { SegmentInput } from "cellpose-js";
import type { GraphModel } from "@tensorflow/tfjs";

const KIND_NAME = "cellpose_cells";

// URL prefix (same-origin) where ORT-web's WASM/JSEP sidecar files are served.
// See scripts/copyOrtWasm.js, which copies them into public/ort/.
const ORT_WASM_PATH = "/ort/";

// 588 MB FP16 ONNX model. Defaults to the public HuggingFace copy; override via
// the VITE_CELLPOSE_SAM_MODEL_URL env var to self-host.
const MODEL_URL =
  (import.meta.env.VITE_CELLPOSE_SAM_MODEL_URL as string | undefined) ??
  "https://huggingface.co/ballon999/cellpose-sam-onnx/resolve/main/cpsam_fp16.onnx";

// Cellpose-SAM is channel-agnostic; mirror the legacy Cellpose defaults
// (grayscale primary, no secondary, ~30px median diameter). Tunable.
const SEGMENT_OPTIONS = { diameter: 30, chan: 0, chan2: 0 } as const;

/*
 * Cellpose-SAM (browser-side)
 * https://github.com/belkassaby/Cellpose.js
 *
 * Generalist instance segmentation for cells/nuclei, running fully in-browser on
 * WebGPU via ONNX Runtime Web (no server, unlike the cloud `Cellpose` model).
 * Requires a WebGPU-capable browser with native Float16Array (Chrome >=135 /
 * Safari >=17.4); `fromPretrained` throws `UnsupportedEnvironmentError` otherwise.
 */
export class CellposeSAM extends Segmenter {
  protected readonly segmentedKind = KIND_NAME;

  private _cp?: CellposeJs;

  constructor() {
    super({
      name: "Cellpose-SAM",
      kind: KIND_NAME,
      task: ModelTask.Segmentation,
      graph: true,
      pretrained: true,
      trainable: false,
      requiredChannels: 3,
    });
  }

  public async loadModel() {
    if (this._model) return;

    configureOrt({ wasmPaths: ORT_WASM_PATH });

    try {
      this._cp = await CellposeJs.fromPretrained(MODEL_URL, {
        preload: true,
        onProgress: ({ loaded, total }) =>
          logger(
            `[Cellpose-SAM] downloading model: ${loaded}${
              total ? ` / ${total}` : ""
            } bytes`,
          ),
        onStatus: (status) => logger(`[Cellpose-SAM] ${status}`),
      });
    } catch (err) {
      logger(err);
    }

    // cellpose-js is not a TFJS model, but the Model/Segmenter machinery expects
    // a disposable `_model` handle (and uses it to report `modelLoaded`). Mirror
    // the cloud `Cellpose` model and install a no-op stand-in.
    this._model = { dispose: () => {} } as GraphModel;
  }

  private async toSegmentInput(item: InferenceInput): Promise<SegmentInput> {
    const xs = await channelsToTensor(
      item.channelsRef,
      item.shape,
      item.region,
    );
    // channelsToTensor yields interleaved HWC Float32 raw pixel values.
    // cellpose-js normalizes per-channel internally (percentile normalize99),
    // so the raw values are passed straight through.
    const data = (await xs.data()) as Float32Array;
    const [height, width, channels] = xs.shape;
    xs.dispose();
    return { data, width, height, channels };
  }

  public async predict(items: InferenceInput[], loadCb?: LoadCB) {
    if (!this._cp) {
      throw Error(`"${this.name}" Model not loaded`);
    }

    const annotations: Array<PredictedAnnotationObject[]> = [];
    for (const [idx, item] of items.entries()) {
      const input = await this.toSegmentInput(item);
      const annotObj = await predictCellposeSAM(
        this._cp,
        input,
        this.segmentedKind,
        SEGMENT_OPTIONS,
      );
      annotations.push(annotObj);
      if (loadCb) {
        loadCb(
          (idx + 1) / items.length,
          `${idx + 1} of ${items.length} images predicted`,
        );
      }
    }

    return annotations;
  }

  // cellpose-js has no static TFJS input/output shape; the base getters read
  // `_model.inputs/outputs`, which the no-op stand-in lacks.
  public override get defaultInputShape(): number[] {
    return undefined as unknown as number[];
  }

  public override get defaultOutputShape(): number[] | undefined {
    return undefined;
  }

  public override dispose() {
    void this._cp?.dispose();
    this._cp = undefined;
    super.dispose();
  }
}
