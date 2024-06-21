import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../utils.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener usuarios." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el usuario." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({
        message: "¡Usuario actualizado con éxito!",
        user: updatedUser,
      });
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el usuario." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@webshopx.com") {
        res
          .status(400)
          .send({ message: "¡No se puede eliminar al usuario administrador!" });
        return;
      }
      await user.deleteOne();
      res.send({ message: "¡Usuario eliminado con éxito!" });
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el usuario." });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      res.status(401).send({ message: "¡Email o contraseña incorrecta!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al iniciar sesión." });
  }
};

export const signup = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).send({ message: "Error al registrar el usuario." });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al actualizar el perfil del usuario." });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al verificar el correo electrónico." });
  }
};
