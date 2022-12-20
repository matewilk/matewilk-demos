const users = [{ id: 0, login: "Bob" }];

export default {
  Query: {
    user: (_: void, { id }: { id: number }) => users[id],
    users: () => users,
  },
};
