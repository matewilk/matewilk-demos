import { render } from "@/utils/test-utils";
import { ApolloProvider } from "@apollo/client";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { apolloClient } from "@/hooks/useWebSocketClient";
import Chats, { getServerSideProps } from "./index";

jest.mock("@/components/layout/Header", () => () => <div>Header</div>);

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
  it("should render a list of chats and header", () => {
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
    const contextMock = {};
    const res = await getServerSideProps(contextMock as any);

    const expected = { props: { chats: expectedChats } };
    expect(res).toEqual(expected);
  });
});
