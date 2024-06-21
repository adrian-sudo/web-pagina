import expressAsyncHandler from "express-async-handler";
import * as userController from "../controllers/userController.js";

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  userController.getAllUsers(req, res);
});

export const getUserById = expressAsyncHandler(async (req, res) => {
  userController.getUserById(req, res);
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  userController.updateUser(req, res);
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  userController.deleteUser(req, res);
});

export const signin = expressAsyncHandler(async (req, res) => {
  userController.signin(req, res);
});

export const signup = expressAsyncHandler(async (req, res) => {
  userController.signup(req, res);
});

export const updateUserProfile = expressAsyncHandler(async (req, res) => {
  userController.updateUserProfile(req, res);
});

export const checkEmail = expressAsyncHandler(async (req, res) => {
  userController.checkEmail(req, res);
});