import { Person } from "./starWarsApi";
// import DataLoader from 'dataloader';

export const resolvers = {
  Query: {
    hello: (_: any, parameters: { name: string; }): string => {
      return `Hello ${parameters.name}!`;
    },

  },
  // Starship: {

  // },
  // Person: {

  // },
};