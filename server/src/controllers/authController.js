import jwt from "jsonwebtoken";
import User from "../models/User.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

function signAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required", errors: [] });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password", errors: [] });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res
      .cookie("token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({
        success: true,
        data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
        message: "Logged in",
      });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
export function logout(req, res) {
  res.clearCookie("token", cookieOptions).clearCookie("refreshToken", cookieOptions).json({
    success: true,
    data: null,
    message: "Logged out",
  });
}

// POST /api/auth/refresh
export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token", errors: [] });
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists", errors: [] });
    }

    const accessToken = signAccessToken(user);
    res
      .cookie("token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .json({ success: true, data: null, message: "Token refreshed" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token", errors: [] });
  }
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", errors: [] });
    }
    res.json({ success: true, data: { user }, message: "Current user" });
  } catch (err) {
    next(err);
  }
}
