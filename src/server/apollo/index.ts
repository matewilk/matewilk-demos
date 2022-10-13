import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
