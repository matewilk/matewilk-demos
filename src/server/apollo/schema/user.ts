import { gql } from "apollo-server-micro";

export default gql`
  type User {
    id: ID
    login: String
  }

  extend type Query {
    user(id: ID!): User
    users: [User]
  }
`;
