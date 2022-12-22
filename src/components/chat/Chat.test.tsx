import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import {
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
} from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";

import { Chat } from "@/components/chat/Chat";

const queries = [
  {
    request: {
      query: gql`
        subscription Subscription($chatId: String) {
          chat(id: $chatId) {
            message
          }
        }
      `,
      variables: { chatId: "1" },
    },
    result: () => {
      return {
        data: {
          chat: {
            message: "Hello World",
          },
        },
      };
    },
  },
  {
    request: {
      query: gql`
        subscription Subscription($chatId: String) {
          chat(id: $chatId) {
            message
          }
        }
      `,
      variables: { chatId: "1" },
    },
    result: () => {
      return {
        data: {
          chat: {
            message: "Hello World 2",
          },
        },
      };
    },
  },
  // {
  //   request: {
  //     query: gql`
  //       mutation Mutation($chatId: String!, $message: String!) {
  //         sendMessage(chatId: $chatId, message: $message) {
  //           message
  //         }
  //       }
  //     `,
  //     variables: {
  //       chatId: "1",
  //       message: "Hello World",
  //     },
  //   },
  //   result: () => {
  //     return {
  //       data: {
  //         sendMessage: {
  //           message: "Hello World 1",
  //         },
  //         chat: {
  //           message: "Hello World 1",
  //         },
  //       },
  //     };
  //   },
  // },
];

const client = new ApolloClient({
  link: from([]),
  cache: new InMemoryCache(),
});

// jest.mock("@/hooks/useChat", () => {
//   return {
//     ...jest.requireActual("@/hooks/useChat"),
//     messages: [
//       { id: "1", text: "Hello", sender: "user" },
//       { id: "2", text: "Hi", sender: "other" },
//     ],
//   };
// });

import { apolloClient } from "@/helpers/webSocketClient";

describe("ChatWindow", () => {
  beforeEach(() => {
    render(
      <ApolloProvider client={apolloClient()}>
        {/* <MockedProvider mocks={queries} addTypename={false}> */}
        <Chat />
        {/* </MockedProvider> */}
      </ApolloProvider>
    );
  });

  it("renders messages", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });
  });

  it("renders message when user sends message", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello World" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
  });
});
