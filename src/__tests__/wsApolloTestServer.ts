import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";

import ws, { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { typeDefs } from "../server/apollo/schema";
import { resolvers } from "../server/apollo/resolvers";

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export const gqlWsServer = async () => {
  const app = express();
  app.use(express.json());
  const httpServer = createServer(app);

  const RANDOM_HTTP_PORT = 3000; // Math.floor(Math.random() * 10000);
  const RANDOM_WS_PORT = 3001; // Math.floor(Math.random() * 10000);

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const pubSub = new PubSub();

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: () => {
      return {
        pubSub: pubSub,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/api/graphql" });

  const wsServer = new WebSocketServer({
    // server: httpServer,
    path: "/api/graphql",
    port: RANDOM_WS_PORT,
  });

  const serverCleanup = useServer(
    {
      schema,
      context: () => {
        return {
          pubSub: pubSub,
        };
      },
    },
    wsServer
  );

  // The uri of the WebSocketLink has to match the customServer uri.
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `ws://localhost:${RANDOM_WS_PORT}/api/graphql`,
      webSocketImpl: ws,
    })
  );

  const apolloClient = new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
  });

  await new Promise((resolve) =>
    httpServer.listen({ port: RANDOM_HTTP_PORT }, resolve)
  );
  console.log(
    `🚀 Query endpoint ready at http://localhost:${RANDOM_HTTP_PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${RANDOM_WS_PORT}${server.graphqlPath}`
  );
  // wait for websocket client to connect to subscription server
  await wait(1000);

  return {
    port: RANDOM_HTTP_PORT,
    app,
    wsLink,
    httpServer,
    server,
    apolloClient,
    pubSub,
  };
};
