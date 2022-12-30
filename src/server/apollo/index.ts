import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { Disposable } from "graphql-ws";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { WebSocketServer } from "ws";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { env } from "../../env/server.mjs";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT as unknown as number,
};

const redisPubSub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

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
      pubSub: redisPubSub,
    };
  },
});

const isDev = process.env.NODE_ENV !== "production";

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
      // set port to 3001 for dev env to avoid conflict with nextjs hot reload
      const options = {
        path: "/api/graphql",
        ...(isDev && { port: 3001 }),
        ...(!isDev && { server: res.socket.server }),
      };
      const wss = new WebSocketServer(options);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      serverCleanup = useServer(
        {
          schema,
          context() {
            return { pubSub: redisPubSub };
          },
        },
        wss
      );
    }
  }

  return apolloServer;
};
