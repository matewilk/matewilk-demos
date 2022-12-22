import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const apolloClient = () => {
  // ws port is 3001 in dev as to not interfere wtih the nextjs dev server (hot reloading)
  const PORT = process.env.NODE_ENV === "production" ? 3000 : 3001;
  const WS_ENDPOINT = `ws://localhost:${PORT}/api/graphql`;

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
