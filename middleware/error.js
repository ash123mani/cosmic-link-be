const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message

  console.log("err", err)

  if (err.code === 11000) {
    const message = "Duplicate Field value error";
    error = new ErrorResponse(message, 400);
  }

  if (err.code === "ValidationError") {
    const message = Object.keys(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message|| "Server Error"
  })
}

module.exports = errorHandler;
