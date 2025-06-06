const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(
      new AppError(
        "Please provide name, email, password, and passwordConfirm for the new admin.",
        400
      )
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("This email is already registered.", 400));
  }

  const newAdmin = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role: "admin",
  });

  newAdmin.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user: newAdmin,
    },
  });
});

exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: "admin" }).select(
    "-password -__v -passwordChangedAt -passwordResetToken -passwordResetExpires"
  );

  res.status(200).json({
    status: "success",
    results: admins.length,
    data: {
      admins,
    },
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const adminId = req.params.id;
  const adminToDelete = await User.findById(adminId);

  if (!adminToDelete) {
    return next(new AppError("No admin found with that ID.", 404));
  }

  if (adminToDelete.role !== "admin") {
    return next(new AppError("This user is not an admin. Cannot delete.", 400));
  }

  // if (adminToDelete.id === req.user.id) {
  //     return next(new AppError('You cannot delete your own account.', 403));
  // }

  await User.findByIdAndDelete(adminId);

  res.status(204).json({
    // 204 No Content
    status: "success",
    data: null,
  });
});
