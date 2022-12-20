import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { Disposable } from "graphql-ws";
import { WebSocketServer } from "ws";
import { PubSub } from "graphql-subscriptions";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const pubSub = new PubSub();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let serverCleanup: Disposable | null = null;

export const server = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup?.dispose();
          },
        };
      },
    },
  ],
  context: ({ req, res }) => {
    return {
      req,
      res,
      // subscription solution (with remote redis)
      pubSub,
    };
  },
});

// ws server setup
// https://stackoverflow.com/a/72240628/1976982
const wsServer = new WebSocketServer({ noServer: true });

export const webSocketServer = (res: any) => {
  res.socket.server.on("connection", (ws: any) => {
    ws.on("error", console.error);
  });
  res.socket.server.on("upgrade", function (request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function (ws) {
      wsServer.emit("connection", ws);
    });
  });
  serverCleanup = useServer(
    {
      schema,
      context: () => {
        return {
          pubSub,
        };
      },
    },
    wsServer
  );
  return wsServer;
};
