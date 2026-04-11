import taskService from "../services/task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json({
      message: "Task created successfully",
      taskId: task._id,
    });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
