import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const apolloClient = () => {
  const PORT = process.env.NODE_ENV === "production" ? 3000 : 3001;
  const WS_ENDPOINT = `ws://localhost:${PORT}/api/graphql`;
  // const HTTP_ENDPOINT = `http://localhost:3000/api/graphql`;

  const wsLink = new GraphQLWsLink(
    createClient({
      url: WS_ENDPOINT,
      webSocketImpl: typeof window !== "undefined" ? WebSocket : require("ws"),
    })
  );

  return new ApolloClient({
    link: wsLink,
    // uri: HTTP_ENDPOINT,
    cache: new InMemoryCache(),
    // connectToDevTools: typeof window !== "undefined" ? true : false,
  });
};
