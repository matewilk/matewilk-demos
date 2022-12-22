import { screen, render, waitFor } from "@testing-library/react";
import {
  gql,
  ApolloClient,
  ApolloProvider,
  from,
  InMemoryCache,
} from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";

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
];

const client = new ApolloClient({
  link: from([]),
  cache: new InMemoryCache(),
});

describe("ChatWindow", () => {
  beforeEach(() => {
    render(
      <ApolloProvider client={client}>
        <MockedProvider mocks={queries} addTypename={false}>
          <Chat />
        </MockedProvider>
      </ApolloProvider>
    );
  });

  it("renders messages", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });
  });

  it("renders message when message is received", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
  });
});
