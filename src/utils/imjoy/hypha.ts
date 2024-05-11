import { hyphaWebsocketClient } from "imjoy-rpc";
import { EnhancedStore } from "@reduxjs/toolkit";

import { llog, LOG_LEVEL } from "utils/common/helpers";
import { dataToImage } from "utils/common/tensorHelpers";
import { TypedArray } from "utils/file-io/types";
import { dataSlice } from "store/data/dataSlice";
import { selectCategoriesByKind } from "store/data/selectors";

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
  llog(imageReq, LOG_LEVEL.IMJOY);
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

  llog(image, LOG_LEVEL.IMJOY);

  store.dispatch(
    dataSlice.actions.addThings({
      things: [image],
      isPermanent: true,
    })
  );
};

export const createService = async (
  store: EnhancedStore,
  token: string,
  workspace: string
) => {
  const server = await hyphaWebsocketClient.connectToServer({
    ...SERVER_CONFIG,
    token,
    workspace,
  });
  llog(server, LOG_LEVEL.IMJOY);

  const svc = await server.register_service({
    name: "PIXIMI Annotator",
    id: "piximi-annotator",
    receiveImage: (
      imageReq: any,
      imageName: string,
      cIdx: number = 0,
      hIdx: number = 1,
      wIdx: number = 2
    ) => _receiveImage(store, imageReq, imageName, cIdx, hIdx, wIdx),
  });

  llog(svc, LOG_LEVEL.IMJOY);
};
