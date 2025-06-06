const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllUsersAndAdminsForSuperAdmin = catchAsync(
  async (req, res, next) => {
    const users = await User.find({ role: { $in: ["user", "admin"] } }).select(
      "name email role createdAt"
    );

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }
);

exports.getAllUsersForAdmin = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "user" }).select(
    "name email role createdAt"
  );

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.deleteUserByAdminOrSuperAdmin = catchAsync(async (req, res, next) => {
  const userIdToDelete = req.params.id;
  const userToDelete = await User.findById(userIdToDelete);

  if (!userToDelete) {
    return next(new AppError("No user found with that ID.", 404));
  }

  if (req.user.role === "superadmin") {
    if (userToDelete.role === "superadmin") {
      return next(
        new AppError("A superadmin cannot delete another superadmin.", 403)
      );
    }

    if (userToDelete.id === req.user.id) {
      return next(
        new AppError(
          "You cannot delete your own account using this route.",
          403
        )
      );
    }
  } else if (req.user.role === "admin") {
    if (userToDelete.role !== "user") {
      return next(
        new AppError('Admins can only delete users with the "user" role.', 403)
      );
    }
  } else {
    return next(
      new AppError("You do not have permission to perform this action.", 403)
    );
  }

  await User.findByIdAndDelete(userIdToDelete);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
