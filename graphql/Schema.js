import { GraphQLSchema } from "graphql";
import Query from "./Query.js";       // add .js extension for ESM
import Mutation from "./Mutation.js";

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default Schema;
