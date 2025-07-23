import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from "graphql";

const User = new GraphQLObjectType({
  name: "User",
  description: "This represents a User",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(user) {
        return user.id;
      },
    },
    firstName: {
      type: GraphQLString,
      resolve(user) {
        return user.firstName;
      },
    },
    lastName: {
      type: GraphQLString,
      resolve(user) {
        return user.lastName;
      },
    },
    username: {
      type: GraphQLString,
      resolve(user) {
        return user.username;
      },
    },
    password: {
      type: GraphQLString,
      resolve(user) {
        return user.password;
      },
    },
    email: {
      type: GraphQLString,
      resolve(user) {
        return user.email;
      },
    },
    permissions: {
      type: GraphQLString,
      resolve(user) {
        return user.permissions;
      },
    },
  }),
});

const Post = new GraphQLObjectType({
  name: "Post",
  description: "This is a post",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(post) {
        return post.id;
      },
    },
    title: {
      type: GraphQLString,
      resolve(post) {
        return post.title;
      },
    },
    quantity: {
      type: GraphQLInt,
      resolve(post) {
        return post.quantity;
      },
    },
    instructions: {
      type: GraphQLString,
      resolve(post) {
        return post.instructions;
      },
    },
    address: {
      type: GraphQLString,
      resolve(post) {
        return post.address;
      },
    },
    city: {
      type: GraphQLString,
      resolve(post) {
        return post.city;
      },
    },
    state: {
      type: GraphQLString,
      resolve(post) {
        return post.state;
      },
    },
    date: {
      type: GraphQLString,
      resolve(post) {
        return post.date;
      },
    },
    startTime: {
      type: GraphQLString,
      resolve(post) {
        return post.startTime;
      },
    },
    endTime: {
      type: GraphQLString,
      resolve(post) {
        return post.endTime;
      },
    },
    postedBy: {
      type: User,
      resolve(post) {
        return post.getUser();
      },
    },
  }),
});

const AuthPayload = new GraphQLObjectType({
  name: "AuthPayload",
  description: "This is what results from a successful login",
  fields: () => ({
    token: {
      type: GraphQLString,
      resolve(payload) {
        return payload.token;
      },
    },
    user: {
      type: User,
      resolve(payload) {
        // Your original code called payload.getUser(), but
        // usually this should be just payload.user or similar,
        // update if necessary:
        return payload.user;
      },
    },
  }),
});

const Reservation = new GraphQLObjectType({
  name: "Reservation",
  description: "This is how a user knows what events he has RSVPd to.",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(reservation) {
        return reservation.id;
      },
    },
    userId: {
      type: GraphQLString,
      resolve(reservation) {
        return reservation.userId;
      },
    },
    post: {
      type: Post,
      resolve(reservation) {
        return reservation.getPost();
      },
    },
  }),
});

export { User, Post, AuthPayload, Reservation };
