import { gql } from "apollo-server-micro";

import user from "./user";
import chat from "./chat";

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export const typeDefs = [linkSchema, user, chat];
