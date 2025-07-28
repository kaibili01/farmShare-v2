import db from "../models/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function apiRoutes(app) {
  // Register a new user
  app.post("/api/register", async (req, res) => {
    try {
      const { email, username, password, firstName, lastName } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({
          error: "Email, username, and password are required.",
        });
      }

      const existingUser = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          error: "User with that email or username already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.User.create({
        email,
        username,
        password: hashedPassword,
        firstName: firstName || "Test",
        lastName: lastName || "User",
      });

      res.status(201).json({
        message: "User registered successfully",
        userId: newUser.id,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login route using email or username
  app.post("/api/login", async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if ((!email && !username) || !password) {
        return res.status(400).json({
          error: "Username or email and password are required.",
        });
      }

      const user = await db.User.findOne({
        where: email ? { email } : { username },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.APP_SECRET || "defaultsecret",
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
