import { createClient } from "redis";
let redisClient;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("Redis Connected Successfully");
  } catch (error) {
    console.error("Could not connect to Redis", error);
  }
};

export { redisClient };
