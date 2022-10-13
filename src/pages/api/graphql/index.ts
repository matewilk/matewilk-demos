import type { NextApiRequest, NextApiResponse } from "next";
import Cors, { CorsRequest } from "cors";
import { server } from "../../../server/apollo";

type Cors = {
  (
    req: CorsRequest,
    res: {
      statusCode?: number | undefined;
      setHeader(key: string, value: string): any;
      end(): any;
    },
    next: (err?: any) => any
  ): void;
};

// Initializing the cors middleware
// You can read here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function allowCors(req: NextApiRequest, res: NextApiResponse, fn: Cors) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any): void => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run cors middleware (to allow Apollo Studio access - only on dev/test)
  process.env.NODE_ENV !== "production"
    ? await allowCors(req, res, cors)
    : null;
  // run apollo server
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
