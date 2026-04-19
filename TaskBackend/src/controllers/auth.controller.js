import authService from "../services/auth.service.js";

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.signup(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const { user, token } = await authService.verifyOTP(email, otp);
    setTokenCookie(res, token);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tier: user.subscriptionTier,
        taskLimit: user.taskLimit,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getGoogleAuthUrl = (req, res, next) => {
  try {
    const url = authService.getGoogleAuthUrl();
    res.json({ url });
  } catch (err) {
    next(err);
  }
};

export const googleAuthCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    const { user, token } = await authService.handleGoogleCallback(code);

    setTokenCookie(res, token);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/auth/status?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&tier=${encodeURIComponent(user.subscriptionTier)}&taskLimit=${encodeURIComponent(String(user.taskLimit))}`,
    );
  } catch (err) {
    console.error("Google Auth Error:", err);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/status?error=auth_failed`);
  }
};
