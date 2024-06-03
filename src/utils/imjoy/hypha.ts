import { hyphaWebsocketClient } from "imjoy-rpc";
import { EnhancedStore } from "@reduxjs/toolkit";

import { llog, LOG_LEVEL } from "utils/common/helpers";
import { dataToImage } from "utils/common/tensorHelpers";
import { TypedArray } from "utils/file-io/types";
import { dataSlice } from "store/data/dataSlice";
import { selectCategoriesByKind } from "store/data/selectors";
import {
  DecodedAnnotationObject,
  KindWithCategories,
  Shape,
} from "store/data/types";
import { annsToLabelMask } from "utils/annotator/imageHelper";

const PORT = "9191";

const SERVER_CONFIG = {
  name: "piximi-server",
  server_url: `http://localhost:${PORT}`,
  config: {
    visibility: "private",
  },
};

interface ImageReq {
  _rdtype: string;
  _rshape: number[];
  _rtype: string;
  _rvalue: TypedArray;
}

let server: any = undefined;
let receiveService: any = undefined;
let sendService: any = undefined;

const validateImageReq = (imageReq: any) => {
  // TODO - hypha: validate fields exist and are of right type
  if (imageReq._rshape.length !== 3)
    throw Error("Invalid _rshape length", imageReq._rshape);
  return imageReq as ImageReq;
};

const _receiveImage = async (
  store: EnhancedStore,
  imageReq: any,
  imageName: string,
  cIdx: number,
  hIdx: number,
  wIdx: number
) => {
  llog(LOG_LEVEL.IMJOY)("received image req", imageReq);
  const validImageReq = validateImageReq(imageReq);

  const shape = [1, ...validImageReq._rshape] as [
    number,
    number,
    number,
    number
  ];
  let permute = undefined;

  if (cIdx !== 2 || hIdx !== 0 || wIdx !== 1) {
    permute = [0, hIdx + 1, wIdx + 1, cIdx + 1]; // [Z, H, W, C]
  }

  const imageBuffer = new Float32Array(
    validImageReq._rvalue,
    validImageReq._rvalue.byteOffset
  );

  const kind = "Image";
  // TODO - hypha: how to do this cleaner???
  const imageKindUnknownCategory = selectCategoriesByKind(store.getState())(
    kind
  ).filter((c) => c.name === "Unknown")[0];

  const bitDepth = 8;

  const image = await dataToImage(
    kind,
    imageKindUnknownCategory.id,
    imageName,
    imageBuffer,
    shape,
    bitDepth,
    permute
  );

  llog(LOG_LEVEL.IMJOY)("image req -> image", image);

  store.dispatch(
    dataSlice.actions.addThings({
      things: [image],
      isPermanent: true,
    })
  );
};

const createServer = async (token: string, workspace: string) => {
  server = await hyphaWebsocketClient.connectToServer({
    ...SERVER_CONFIG,
    token,
    workspace,
  });
  llog(LOG_LEVEL.IMJOY)("created server", server);
};

export const createReceiveService = async (
  store: EnhancedStore,
  token: string,
  workspace: string
) => {
  if (server === undefined) {
    await createServer(token, workspace);
  }

  if (receiveService === undefined) {
    receiveService = await server.register_service({
      name: "PIXIMI Annotator Receive Service",
      id: "piximi-annotator-receiver",
      receiveImage: (
        imageReq: any,
        imageName: string,
        cIdx: number = 0,
        hIdx: number = 1,
        wIdx: number = 2
      ) => _receiveImage(store, imageReq, imageName, cIdx, hIdx, wIdx),
    });

    llog(LOG_LEVEL.IMJOY)("create receive service", receiveService);
  } else {
    console.error(
      "Attempted to set up hypha receive service when one already exists"
    );
  }
};

export const connectSendService = async () => {
  if (server === undefined) {
    llog(LOG_LEVEL.IMJOY)(
      "No server established, skipping sending annotations"
    );
  }

  sendService = await server.get_service("piximi-annotator-sender");

  if (sendService !== undefined) {
    llog(LOG_LEVEL.IMJOY)("connected to send service", sendService);
  } else {
    llog(LOG_LEVEL.IMJOY)("failed to connect to send service");
  }
};

export const sendAnnotations = async (
  imageShape: Shape,
  annotations: DecodedAnnotationObject[],
  kinds: KindWithCategories[]
) => {
  if (receiveService === undefined) {
    llog(LOG_LEVEL.IMJOY)("No receive service, skipping sending annotations");
    return;
  }

  try {
    const labelMaskDict = annsToLabelMask(imageShape, annotations, kinds);
    const kindNames = Object.keys(labelMaskDict);
    const cats = Object.keys(labelMaskDict[kindNames[0]]);
    const labelMask = labelMaskDict[kindNames[0]][cats[0]];

    if (sendService === undefined) {
      await connectSendService();
    }

    if (sendService !== undefined) {
      sendService.send_annotations(labelMask);
    }
  } catch (err) {
    console.error(err);
  }
};
