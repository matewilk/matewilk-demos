import { gql } from "apollo-server-micro";

export default gql`
  extend type Subscription {
    chat(id: String): Message
  }

  extend type Mutation {
    sendMessage(chatId: String!, text: String!, userId: String!): Message
  }

  extend type Query {
    chatHistory(chatId: String!): [Message]
  }

  type Message {
    id: ID!
    text: String
    userId: String
  }
`;
