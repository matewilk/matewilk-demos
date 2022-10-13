const users = [{ id: 0, login: "Bob" }];

export const resolvers = {
  Query: {
    user: (_: void, { id }: { id: number }) => users[id],
    users: () => users,
  },
};
