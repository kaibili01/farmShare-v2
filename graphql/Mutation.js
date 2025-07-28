import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/db.js";
import { User, Post, AuthPayload, Reservation } from "./TypeDefs.js";
import dotenv from "dotenv";

dotenv.config(); 

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Functions to create, authenticate, and manage entities",
  fields: () => ({
    // LOGIN
    login: {
      type: AuthPayload,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const user = await db.sequelize.models.User.findOne({
          where: { username: args.username },
        });

        if (!user) {
          throw new Error("No such user found.");
        }

        const valid = bcrypt.compareSync(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password.");
        }

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        return { token, user };
      },
    },

    // REGISTER USER
addUser: {
  type: User,
  args: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_, args) {
    const { firstName, lastName, username, email, password } = args;

    const existingUser = await db.sequelize.models.User.findOne({ where: { username } });
    if (existingUser) throw new Error("Username already taken.");

    const existingEmail = await db.sequelize.models.User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingEmail) throw new Error("Email already registered.");

    const hashedPassword = bcrypt.hashSync(password, 10); // 10 salt rounds

    return db.sequelize.models.User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      email: email.toLowerCase(),
      permissions: JSON.stringify({
        post: true,
        harvest: true,
        admin: false,
      }),
    });
  },
},

    // ADD POST
    addPost: {
      type: Post,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
        instructions: { type: GraphQLString },
        address: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        startTime: { type: new GraphQLNonNull(GraphQLString) },
        endTime: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const decrypted = jwt.verify(args.userId, process.env.APP_SECRET);
        const user = await db.sequelize.models.User.findByPk(decrypted.userId);

        if (!user) {
          throw new Error("User not found.");
        }

        return user.createPost({
          title: args.title,
          quantity: args.quantity,
          instructions: args.instructions,
          address: args.address,
          city: args.city,
          state: args.state,
          date: args.date,
          startTime: args.startTime,
          endTime: args.endTime,
        });
      },
    },

    // ADD RESERVATION
    addReservation: {
      type: Reservation,
      args: {
        jwt: { type: new GraphQLNonNull(GraphQLString) },
        postId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(_, args) {
        const decrypted = jwt.verify(args.jwt, process.env.APP_SECRET);

        return db.sequelize.models.Reservation.create({
          userId: parseInt(decrypted.userId),
          postId: args.postId,
        });
      },
    },

    // REMOVE RESERVATION
    removeReservation: {
      type: Reservation,
      args: {
        jwt: { type: new GraphQLNonNull(GraphQLString) },
        postId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(_, args) {
        const decrypted = jwt.verify(args.jwt, process.env.APP_SECRET);

        await db.sequelize.models.Reservation.destroy({
          where: {
            userId: parseInt(decrypted.userId),
            postId: args.postId,
          },
        });

        return {
          userId: parseInt(decrypted.userId),
          postId: args.postId,
        };
      },
    },

    // REMOVE USER
    removeUser: {
      type: User,
      args: {
        jwt: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args) {
        const decrypted = jwt.verify(args.jwt, process.env.APP_SECRET);

        const deleted = await db.sequelize.models.User.destroy({
          where: { id: parseInt(decrypted.userId) },
        });

        if (!deleted) {
          throw new Error("User not found or already deleted.");
        }

        return { id: parseInt(decrypted.userId) };
      },
    },
  }),
});

export default Mutation;
