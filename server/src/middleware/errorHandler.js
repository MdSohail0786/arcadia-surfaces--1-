export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = [];

  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => e.message);
  }

  if (err.code === 11000) {
    status = 409;
    message = "Duplicate value";
    errors = Object.keys(err.keyValue || {}).map((k) => `${k} already exists`);
  }

  res.status(status).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
