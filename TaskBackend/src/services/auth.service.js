import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { redisClient } from "../config/redis.js";
import { sendOTPEmail } from "../utils/email.util.js";

class AuthService {
  #getGoogleConfig() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) return null;
    return { clientId, clientSecret, redirectUri };
  }

  #getGoogleClient() {
    const cfg = this.#getGoogleConfig();
    if (!cfg) return null;
    return new OAuth2Client(cfg.clientId, cfg.clientSecret, cfg.redirectUri);
  }

  #generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );
  }

  #generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signup(name, email, password) {
    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
    });

    return user;
  }

  async login(email, password) {
    if (!email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    if (user.authProvider === "google") {
      const error = new Error("Please log in using your Google account.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const otp = this.#generateOTP();

    if (!redisClient) {
      const error = new Error("Server configuration error: Cache unavailable.");
      error.statusCode = 500;
      throw error;
    }

    await redisClient.setEx(`otp:${user.email}`, 300, otp);

    await sendOTPEmail(user.email, otp);

    return {
      mfaRequired: true,
      email: user.email,
      message: "An OTP has been sent to your email.",
    };
  }

  async verifyOTP(email, otp) {
    if (!email || !otp) {
      const error = new Error("Email and OTP are required");
      error.statusCode = 400;
      throw error;
    }

    const cachedOtp = await redisClient.get(`otp:${email}`);

    if (!cachedOtp || cachedOtp !== otp) {
      const error = new Error("Invalid or expired OTP");
      error.statusCode = 401;
      throw error;
    }

    await redisClient.del(`otp:${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const token = this.#generateToken(user);
    return { user, token };
  }

  getGoogleAuthUrl() {
    const googleClient = this.#getGoogleClient();
    const cfg = this.#getGoogleConfig();

    if (!googleClient || !cfg) {
      const error = new Error("Google auth is not configured.");
      error.statusCode = 500;
      throw error;
    }

    return googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
      redirect_uri: cfg.redirectUri,
    });
  }

  async handleGoogleCallback(code) {
    if (!code) {
      const error = new Error("Missing authorization code");
      error.statusCode = 400;
      throw error;
    }

    const googleClient = this.#getGoogleClient();
    const cfg = this.#getGoogleConfig();

    if (!googleClient || !cfg) {
      const error = new Error("Google auth is not configured.");
      error.statusCode = 500;
      throw error;
    }

    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: cfg.redirectUri,
    });

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: cfg.clientId,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: "google",
        googleId,
      });
    }

    const token = this.#generateToken(user);
    return { user, token };
  }
}

export default new AuthService();
