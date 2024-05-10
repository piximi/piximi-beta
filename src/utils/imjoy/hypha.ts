import { hyphaWebsocketClient } from "imjoy-rpc";
import { EnhancedStore } from "@reduxjs/toolkit";

import { llog, LOG_LEVEL } from "utils/common/helpers";

const PORT = "9191";

const _config = {
  name: "piximi-annotator",
  server_url: `http://localhost:${PORT}`,
  passive: true,
};

export const createService = async (store: EnhancedStore) => {
  const server = await hyphaWebsocketClient.connectToServer(_config);
  llog(server, LOG_LEVEL.IMJOY);
};
