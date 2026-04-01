import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, endDate, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      endDate: endDate || null,
      priority: priority || "Low",
      status: status || "Not Started",
      user: userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      taskId: task._id,
    });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ user: userId }).sort({
      createdAt: -1,
    });

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

    const task = await Task.findOne({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title ?? task.title;
    task.endDate = req.body.endDate ?? task.endDate;
    task.priority = req.body.priority ?? task.priority;
    task.status = req.body.status ?? task.status;

    await task.save();

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
