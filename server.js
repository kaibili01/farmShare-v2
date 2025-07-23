// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "@apollo/server";
import { create } from "express-handlebars"; // updated import for v8+

import typeDefs from "./apollo/typeDefs.js";
import resolvers from "./apollo/resolvers.js"; // ✅ now imported correctly

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
  // Dynamically import route modules
  const apiRoutesModule = await import("./routes/apiRoutes.js");
  const htmlRoutesModule = await import("./routes/htmlRoutes.js");

  const apiRoutes = apiRoutesModule.default || apiRoutesModule;
  const htmlRoutes = htmlRoutesModule.default || htmlRoutesModule;

  // Register routes
  apiRoutes(app);
  htmlRoutes(app);

  // Start Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // Manual middleware for Apollo Server integration
  app.use("/graphql", async (req, res) => {
    try {
      const response = await apolloServer.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          body: req.body,
          headers: req.headers,
          method: req.method,
          search: req.url.split("?")[1] || "",
        },
        context: async () => ({}),
      });

      if ("body" in response) {
        res.status(response.status ?? 200);
        for (const [key, value] of response.headers) {
          res.setHeader(key, value);
        }
        res.send(response.body);
      } else {
        res.sendStatus(500);
      }
    } catch (error) {
      console.error("GraphQL request error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
    console.log(`🌐 Site running at http://localhost:${PORT}/`);
  });
}

startServer();
