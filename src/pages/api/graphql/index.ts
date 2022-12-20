import Cors from "micro-cors";
import { apolloServer, webSocketServer } from "@/server/apollo";

const cors = Cors();

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = apolloServer.start();

const getHandler = async () => {
  await startServer;
  return apolloServer.createHandler({ path: "/api/graphql" });
};

async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return res.end();
  }

  // run apollo server with ws
  webSocketServer(res);

  const handler = await getHandler();
  await handler(req, res);
}

// Run cors middleware (to allow Apollo Studio access - only on dev/test)
export default process.env.NODE_ENV !== "production" ? cors(handler) : handler;
