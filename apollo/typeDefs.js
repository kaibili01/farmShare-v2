// apollo/typeDefs.js
import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    sayHello(name: String!): String
  }
`;

export default typeDefs;
