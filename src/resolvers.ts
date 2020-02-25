export const resolvers = {
  Query: {
    hello: (_: any, parameters: { name: string; }) => {
      return `Hello ${parameters.name}!`;
    }
  }
};