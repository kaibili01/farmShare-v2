import db from "../models/db.js";
import bcrypt from "bcryptjs";

export default function apiRoutes(app) {
  // Register a new user
  app.post("/api/register", async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ error: "Email, username, and password are required." });
      }

      // Check if either the email or username is already taken
      const existingUser = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(409).json({ error: "User with that email or username already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.User.create({
        email,
        username,
        password: hashedPassword,
        firstName: "Test",  // You can change this to req.body.firstName if you start collecting it
        lastName: "User",
      });

      res.status(201).json({ message: "User registered", userId: newUser.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login route using email or username
  app.post("/api/login", async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if ((!email && !username) || !password) {
        return res.status(400).json({ error: "Username or email and password are required." });
      }

      // Find by either email or username
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

      res.json({
        message: "Login successful",
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
