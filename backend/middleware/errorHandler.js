const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // something like /products/abc, which isn't a valid id
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
  }
  // duplicate key, e.g. registering with an email that's taken
  if (err.code === 11000) {
    statusCode = 400;
    message = "That value is already in use";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
