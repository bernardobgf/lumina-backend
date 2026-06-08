import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  profileSettings,
  changePassword,
} from "../controllers/user.controller";

const router = Router();

router.patch("/profile", authMiddleware, profileSettings);
router.patch("/change-password", authMiddleware, changePassword);

export default router;
