import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type User {
    id: ID
    login: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }
`;
