import jwt from "jsonwebtoken";

// Guards write endpoints (POST/PUT/DELETE) behind a signed JWT issued at
// /api/auth/login. Full role-based auth (EDITOR/PRESS/PROFESSIONAL) from the
// original spec is out of scope for this slice — this establishes the pattern
// every other admin route in the app would reuse.
export function requireAdmin(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required", errors: [] });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ success: false, message: "Insufficient permissions", errors: [] });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token", errors: [] });
  }
}
