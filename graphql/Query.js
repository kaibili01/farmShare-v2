import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from "graphql";
import db from "../models/db.js";
import { User, Post, Reservation } from "./TypeDefs.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: () => "Hello from Apollo Server!",
    },

    users: {
      type: new GraphQLList(User),
      args: {
        id: { type: GraphQLInt },
        email: { type: GraphQLString },
      },
      resolve(root, args) {
        return db.sequelize.models.User.findAll({ where: args });
      },
    },

    posts: {
      type: new GraphQLList(Post),
      args: {
        id: { type: new GraphQLList(GraphQLInt) },
      },
      resolve(root, args) {
        return db.sequelize.models.Post.findAll({ where: args });
      },
    },

    reservations: {
      type: new GraphQLList(Reservation),
      args: {
        userId: { type: GraphQLString },
      },
      async resolve(root, args) {
        if (!args.userId) {
          throw new Error("JWT token is required for reservations query");
        }
        let decrypted;
        try {
          decrypted = jwt.verify(args.userId, process.env.APP_SECRET);
        } catch (error) {
          throw new Error("Invalid or expired JWT token");
        }

        return db.sequelize.models.Reservation.findAll({
          where: { userId: decrypted.userId },
        });
      },
    },
  }),
});

export default Query;
