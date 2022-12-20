import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { Disposable } from "graphql-ws";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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

export const apolloServer = new ApolloServer({
  cache: "bounded",
  debug: true,
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            if (serverCleanup) {
              await serverCleanup?.dispose();
            }
          },
        };
      },
    },
  ],
  context: ({ req, res }) => {
    return {
      req,
      res,
      pubSub,
    };
  },
});

// ws server setup
// https://github.com/vercel/next.js/discussions/27680#discussioncomment-3105268
export const webSocketServer = (res: any) => {
  const oldApolloServer = res.socket.server.apolloServer;

  if (oldApolloServer && oldApolloServer !== apolloServer) {
    console.warn("Fixing Apollo Server hot reload");
    oldApolloServer.stop();
    delete res.socket.server.apolloServer;
  }

  if (!res.socket.server.apolloServer) {
    res.socket.server.apolloServer = apolloServer;
    if (!serverCleanup) {
      const wss = new WebSocketServer({
        server: res.socket.server,
        path: "/api/graphql",
      });

      serverCleanup = useServer(
        {
          schema,
          context() {
            return { pubSub };
          },
        },
        wss
      );
    }
  }

  return apolloServer;
};
