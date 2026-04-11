import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { redisClient } from "../config/redis.js";

class TaskService {
  async createTask(userId, taskData) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const taskCount = await Task.countDocuments({ user: userId });

    if (taskCount >= user.taskLimit) {
      const error = new Error(
        `Task limit reached! Your current ${user.subscriptionTier.toUpperCase()} plan only allows ${user.taskLimit} tasks.`,
      );
      error.statusCode = 403;
      error.limitReached = true;
      throw error;
    }

    if (!taskData.title) {
      const error = new Error("Task title is required");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.create({
      title: taskData.title,
      endDate: taskData.endDate || null,
      priority: taskData.priority || "Low",
      status: taskData.status || "Not Started",
      user: userId,
    });

    if (redisClient) await redisClient.del(`tasks:${userId}`);

    return task;
  }

  async getTasks(userId) {
    const cacheKey = `tasks:${userId}`;

    if (redisClient) {
      const cachedTasks = await redisClient.get(cacheKey);
      if (cachedTasks) {
        console.log("Serving from Redis Cache!");
        return JSON.parse(cachedTasks);
      }
    }

    console.log("Serving from MongoDB");
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    if (redisClient) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));
    }

    return tasks;
  }

  async updateTask(userId, taskId, updateData) {
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    task.title = updateData.title ?? task.title;
    task.endDate = updateData.endDate ?? task.endDate;
    task.priority = updateData.priority ?? task.priority;
    task.status = updateData.status ?? task.status;

    await task.save();

    if (redisClient) await redisClient.del(`tasks:${userId}`);

    return task;
  }

  async deleteTask(userId, taskId) {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    if (redisClient) await redisClient.del(`tasks:${userId}`);

    return task;
  }
}

export default new TaskService();
