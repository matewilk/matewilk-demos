import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import { env } from "../env/client.mjs";

// ws port is 3001 in dev as to not interfere wtih the nextjs dev server (hot reloading)
const WS_PORT = process.env.NODE_ENV === "production" ? 3000 : 3001;
const WS_HOST = env.NEXT_PUBLIC_WS_HOST || "localhost";
const WS_GRAPHQL_PATH = env.NEXT_PUBLIC_GRAPHQL_PATH || "/api/graphql";
const WS_ENDPOINT = `${WS_HOST}:${WS_PORT}${WS_GRAPHQL_PATH}`;

export const apolloClient = () => {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: WS_ENDPOINT,
      webSocketImpl: typeof window !== "undefined" ? WebSocket : require("ws"),
    })
  );

  return new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
  });
};
