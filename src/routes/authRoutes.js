import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Todo } from "../db.js";

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create new user
    const user = await User.create({ username, password: hashedPassword });

    // Add default todo
    const defaultTodo = "Hello :) Add your first todo!";
    await Todo.create({ task: defaultTodo, user_id: user._id });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.sendStatus(503);
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

export default router;
