import mongoose from "mongoose";

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

// Todo Schema
const todoSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// ================== MODELS ==================
const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

// ✅ default export for connectDB
export default connectDB;

// ✅ named exports for models
export { User, Todo };
