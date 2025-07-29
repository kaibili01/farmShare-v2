import Schema from "../graphql/Schema.js";
import { graphql } from "graphql";
import dotenv from "dotenv";

dotenv.config();

export default function htmlRoutes(app) {
  // Root page
  app.get("/", (req, res) => {
    res.render("index", {
      msg: "Welcome!"
    });
  });

  // Registration page
  app.get("/register", (req, res) => {
    res.render("register", {
      layout: "register-layout"
    });
  });

  // Login page
  app.get("/login", (req, res) => {
    res.render("login", {
      layout: "login-layout"
    });
  });

  // New post form
  app.get("/newpost", (req, res) => {
    res.render("new-post", {
      layout: "new-post-layout"
    });
  });

  // Basic search page
  app.get("/search", (req, res) => {
    res.render("search", {
      layout: "search-layout"
    });
  });

  // Calendar view
  app.get("/calendar", (req, res) => {
    res.render("my-calendar", {
      layout: "my-calendar-layout"
    });
  });

  // Homepage navigation
  app.get("/home", (req, res) => {
    res.render("navigation", {
      layout: "navigation-layout"
    });
  });

  // Feed (populated via GraphQL)
  app.get("/feed", (req, res) => {
    graphql(
      Schema,
      `
        {
          posts {
            id
            quantity
            title
            instructions
            city
            state
            date
            startTime
            endTime
            postedBy {
              username
              email
            }
          }
        }
      `
    ).then(response => {
      res.render("searchResults", {
        layout: "searchResults-layout",
        posts: response.data.posts
      });
    }).catch(err => {
      console.error("GraphQL error on /feed:", err);
      res.status(500).send("Internal Server Error");
    });
  });

  // Map-based search
  app.get("/maps", (req, res) => {
    graphql(
      Schema,
      `
        {
          posts {
            quantity
            title
            instructions
            address
            city
            state
            date
            startTime
            endTime
            postedBy {
              username
              email
            }
          }
        }
      `
    ).then(response => {
      res.render("searchMaps", {
        layout: "searchMaps-layout",
        posts: response.data.posts,
        googleKey: process.env.GOOGLE_API_KEY
      });
    }).catch(err => {
      console.error("GraphQL error on /maps:", err);
      res.status(500).send("Internal Server Error");
    });
  });

  // You can restore this if you still want a wildcard fallback — just place it LAST.
  // app.get("*", (req, res) => {
  //   res.render("404");
  // });
}
