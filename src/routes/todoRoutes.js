import express from "express";
import { Todo } from "../db.js";

const router = express.Router();

// GET /todos - all todos for logged-in user
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ user_id: req.userId });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

// POST /todos - create new todo
router.post("/", async (req, res) => {
  const { task } = req.body;

  try {
    const todo = await Todo.create({ task, user_id: req.userId });
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

// PUT /todos/:id - update todo completion
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user_id: req.userId },
      { completed },
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

// DELETE /todos/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!id) return res.status(400).json({ message: "Todo id missing" });

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, user_id: userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});


export default router;
