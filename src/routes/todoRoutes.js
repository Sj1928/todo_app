import express from "express";
import { Todo } from "../db.js";

const router = express.Router();

// ================== ROUTES ==================

// GET /todos - all todos for logged-in user
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ user_id: req.userId }).sort({ todoId: 1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

// POST /todos - create new todo
router.post("/", async (req, res) => {
  const { task } = req.body;

  if (!task) return res.status(400).json({ message: "Task is required" });

  try {
    const todo = await Todo.create({ task, user_id: req.userId });
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

// PUT /todos/:todoId - update todo completion
router.put("/:todoId", async (req, res) => {
  const { completed } = req.body;
  const { todoId } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      { todoId: parseInt(todoId), user_id: req.userId },
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

// DELETE /todos/:todoId
router.delete("/:todoId", async (req, res) => {
  const { todoId } = req.params;

  if (!todoId) return res.status(400).json({ message: "Todo id missing" });

  try {
    const todo = await Todo.findOneAndDelete({
      todoId: parseInt(todoId),
      user_id: req.userId,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

export default router;
