import cors from 'cors';
import fs from 'fs';
import path from 'path';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

//@ts-ignore
const schemaString = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");
const typeDefs = gql`${schemaString}`;
const schema = makeExecutableSchema({ typeDefs, resolvers });

export const app = express();

app.use(cors({ origin: '*' }));

app.all('/graphql', (_req: any, res: { redirect: (arg0: string) => any; }) => res.redirect('/'));

// Finally, serve up the GraphQL Schema itself
//@ts-ignore
app.use('/', graphqlHTTP(() => ({ schema: schema, graphiql: true })));
