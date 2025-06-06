const express = require("express");
const userController = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get(
  "/all-for-superadmin",
  restrictTo("superadmin"),
  userController.getAllUsersAndAdminsForSuperAdmin
);

router.get(
  "/all-for-admin",
  restrictTo("admin"),
  userController.getAllUsersForAdmin
);

router.delete(
  "/:id",
  restrictTo("superadmin", "admin"),
  userController.deleteUserByAdminOrSuperAdmin
);

module.exports = router;
