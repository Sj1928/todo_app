import mongoose from "mongoose";

// ================== DB CONNECTION ==================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// ================== SCHEMAS ==================

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Counter Schema (for auto-increment IDs)
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

// Todo Schema
const todoSchema = new mongoose.Schema({
  todoId: { type: Number, unique: true }, // auto-increment field
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Pre-save hook to auto-increment todoId
todoSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "todoId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.todoId = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// ================== MODELS ==================
const User = mongoose.model("User", userSchema);
const Counter = mongoose.model("Counter", counterSchema);
const Todo = mongoose.model("Todo", todoSchema);

// ✅ default export for DB connection
export default connectDB;

// ✅ named exports for models
export { User, Todo, Counter };
