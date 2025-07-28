import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    permissions: String
  }

  type Post {
    id: ID!
    title: String!
    quantity: Int!
    instructions: String
    address: String!
    city: String!
    state: String!
    date: String!
    startTime: String!
    endTime: String!
    userId: String!
  }

  type Reservation {
    id: ID!
    userId: Int!
    postId: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    users(id: Int, email: String): [User]
    posts(id: [Int]): [Post]
    reservations(userId: String): [Reservation]
  }

  type Mutation {
    sayHello(name: String!): String

    login(username: String!, password: String!): AuthPayload

    addUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
    ): User

    addPost(
      title: String!
      quantity: Int!
      instructions: String
      address: String!
      city: String!
      state: String!
      date: String!
      startTime: String!
      endTime: String!
      userId: String!
    ): Post

    addReservation(jwt: String!, postId: Int!): Reservation

    removeReservation(jwt: String!, postId: Int!): Reservation

    removeUser(jwt: String!): User
  }
`;

export default typeDefs;
