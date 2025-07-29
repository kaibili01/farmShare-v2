import pkg from 'graphql-playground-middleware-express';
const expressPlayground = pkg.default;

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { create } from "express-handlebars";

import path from "path";
import { fileURLToPath } from "url";

import db from "./models/db.js";
import schema from "./graphql/Schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    const syncOptions = { force: process.env.NODE_ENV === "test" };
    await db.sequelize.sync(syncOptions);
    console.log("✅ Database synced.");

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

    // Import routes dynamically
    const apiRoutesModule = await import("./routes/apiRoutes.js");
    const htmlRoutesModule = await import("./routes/htmlRoutes.js");

    const apiRoutes = apiRoutesModule.default || apiRoutesModule;
    const htmlRoutes = htmlRoutesModule.default || htmlRoutesModule;

    // Register API routes first
    apiRoutes(app);

    // ✅ Serve GraphQL Playground BEFORE wildcard routes
    app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

    // Register HTML routes (includes wildcard route for 404s)
    htmlRoutes(app);

    // Apollo Server setup
    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/graphql" });

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
      console.log(`🧪 Playground available at http://localhost:${PORT}/playground`);
      console.log(`🌐 Site running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
}

startServer();

export default db;
