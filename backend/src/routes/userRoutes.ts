import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/update").put(protect, updateUserProfile);
router.route("/logout").get(protect, logoutUser);
router
  .route("/:id")
  .put(protect, updateUser)
  .get(protect, getUserById)
  .delete(protect, deleteUser);

export default router;
