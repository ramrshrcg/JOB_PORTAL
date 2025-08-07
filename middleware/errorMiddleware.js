const errorMiddleware = (err, req, res, next) => {
  console.log("Error Middleware:", err);

  // Default error structure
  const defaultError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong, please try again later.",
  };

  // If error is just a string (e.g., from next("some error")):
  if (typeof err === "string") {
    defaultError.message = err;
  }

  res.status(defaultError.statusCode).json({
    success: false,
    statusCode: defaultError.statusCode,
    personalmsge: "An error occurred",
    message: defaultError.message,
  });
};

export default errorMiddleware;
