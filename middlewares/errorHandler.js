module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  console.log(message);
  res.status(status).json({
    message,
  });
};
