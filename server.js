const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");
const connectDB = require("./config/db");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

connectDB();

const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD || "superadmin123",
        12
      );
      await User.create({
        name: process.env.SUPER_ADMIN_NAME || "Super Admin User",
        email: process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com",
        password: hashedPassword,
        passwordConfirm: process.env.SUPER_ADMIN_PASSWORD || "superadmin123",
        role: "superadmin",
      });
      console.log("Super Admin created successfully!");
      console.log(
        "Super Admin Email:",
        process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com"
      );
      console.log(
        "Super Admin Password:",
        process.env.SUPER_ADMIN_PASSWORD || "superadmin123"
      );
    } else {
      // console.log('Super Admin already exists.');
    }
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  }
};

createSuperAdmin();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  if (process.env.NODE_ENV === "development") {
    console.log(`Development server started on http://localhost:${port}`);
  }
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
