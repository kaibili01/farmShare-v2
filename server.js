import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { create } from "express-handlebars";

import schema from "./graphql/Schema.js"; // <-- Use your combined schema here!

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars setup
const exphbs = create({ defaultLayout: "main" });
app.engine("handlebars", exphbs.engine);
app.set("view engine", "handlebars");

async function startServer() {
  // Import routes
  const apiRoutesModule = await import("./routes/apiRoutes.js");
  const htmlRoutesModule = await import("./routes/htmlRoutes.js");

  const apiRoutes = apiRoutesModule.default || apiRoutesModule;
  const htmlRoutes = htmlRoutesModule.default || htmlRoutesModule;

  apiRoutes(app);
  htmlRoutes(app);

  // Create Apollo server using your schema instead of typeDefs/resolvers
  const apolloServer = new ApolloServer({
    schema,
  });

  // Start Apollo server
  await apolloServer.start();

  // Apply Apollo GraphQL middleware and set the path to /graphql
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`🌐 Site running at http://localhost:${PORT}/`);
  });
}

startServer();
