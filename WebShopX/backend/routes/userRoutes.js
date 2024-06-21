import express from "express";
import * as userServices from "../services/userServices.js";
import { isAuth, isAdmin } from "../utils.js";

const router = express.Router();

router.get("/", isAuth, isAdmin, userServices.getAllUsers);
router.get("/:id", isAuth, isAdmin, userServices.getUserById);
router.put("/:id", isAuth, isAdmin, userServices.updateUser);
router.delete("/:id", isAuth, isAdmin, userServices.deleteUser);
router.post("/signin", userServices.signin);
router.post("/signup", userServices.signup);
router.put("/profile/:id", isAuth, userServices.updateUserProfile);
router.post("/check-email", userServices.checkEmail);

export default router;

