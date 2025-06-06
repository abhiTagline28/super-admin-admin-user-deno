const express = require("express");
const adminController = require("../controllers/admin.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);
router.use(restrictTo("superadmin"));

router
  .route("/")
  .post(adminController.createAdmin)
  .get(adminController.getAllAdmins);

router.route("/:id").delete(adminController.deleteAdmin);

module.exports = router;
