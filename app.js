const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/error.middleware");

const authRouter = require("./routes/auth.routes");
const adminManagementRouter = require("./routes/admin.routes");
const userManagementRouter = require("./routes/user.routes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin-management", adminManagementRouter);
app.use("/api/v1/user-management", userManagementRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
