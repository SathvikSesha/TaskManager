// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.routes.js";
// import taskRoutes from "./routes/task.routes.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.json({ message: "Backend is running 🚀" });
// });

// app.use("/api/tasks", taskRoutes);

// export default app;
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://taskly-topaz-sigma.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
