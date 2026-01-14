import pool from "../config/db.js";

/* CREATE TASK */
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { task_name, end_date, priority, status } = req.body;

    if (!task_name) {
      return res.status(400).json({ message: "Task name is required" });
    }

    const start_date = new Date();

    const [result] = await pool.query(
      `INSERT INTO tasks 
       (user_id, task_name, start_date, end_date, priority, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        task_name,
        start_date,
        end_date || null,
        priority || "Low",
        status || "Not Started",
      ]
    );

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

/* GET USER TASKS */
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // 1️⃣ Get existing task
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existingTask = rows[0];

    // 2️⃣ Merge old + new values
    const updatedTask = {
      task_name: req.body.task_name ?? existingTask.task_name,
      start_date: req.body.start_date ?? existingTask.start_date,
      end_date: req.body.end_date ?? existingTask.end_date,
      priority: req.body.priority ?? existingTask.priority,
      status: req.body.status ?? existingTask.status,
    };

    // 3️⃣ Update safely
    await pool.query(
      `UPDATE tasks
       SET task_name = ?, start_date = ?, end_date = ?, priority = ?, status = ?
       WHERE id = ? AND user_id = ?`,
      [
        updatedTask.task_name,
        updatedTask.start_date,
        updatedTask.end_date,
        updatedTask.priority,
        updatedTask.status,
        taskId,
        userId,
      ]
    );

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

/* DELETE TASK */
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id=? AND user_id=?",
      [taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
