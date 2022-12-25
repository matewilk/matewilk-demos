import { render } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { apolloClient } from "@/helpers/webSocketClient";

import Chats from "./index";

const expectedChats = [
  {
    id: "1",
    name: "Chat 1",
  },
  {
    id: "2",
    name: "Chat 2",
  },
];

const haqndlers = [
  rest.get("http://localhost:3000/api/chats", (req, res, ctx) => {
    return res(ctx.json(expectedChats));
  }),
];

const server = setupServer(...haqndlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Chats", () => {
  it("should render a list of chats", () => {
    const { container } = render(
      <ApolloProvider client={apolloClient()}>
        <Chats chats={expectedChats} />
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });
});

describe("serverSideProps", () => {
  it("should fetch chats", async () => {
    const res = await fetch("http://localhost:3000/api/chats");
    const chats = await res.json();
    expect(chats).toEqual(expectedChats);
  });
});