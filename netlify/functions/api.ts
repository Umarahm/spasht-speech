import serverless from "serverless-http";

import { createServer } from "../../backend/server";

export const handler = serverless(createServer());
