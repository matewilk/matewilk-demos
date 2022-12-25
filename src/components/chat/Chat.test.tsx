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
            text
            userId
          }
        }
      `,
      variables: { chatId: "test" },
    },
    result: () => {
      return {
        data: {
          chat: {
            text: "Hello World",
            userId: "1",
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
  const history = [
    {
      id: "1",
      text: "Hello",
    },
    {
      id: "2",
      text: "Hi",
    },
  ];

  beforeEach(() => {
    render(
      <ApolloProvider client={client}>
        <MockedProvider mocks={queries} addTypename={false}>
          <Chat chatId="test" history={history} />
        </MockedProvider>
      </ApolloProvider>
    );
  });

  it("renders messages history", async () => {
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
