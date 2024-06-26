import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET_JWT } from "../config.js";
const passport=require("passport")

export const signupHandler = async (req, res) => {
  try {
    const { name,lastName, email, password, roles } = req.body;

    // Creating a new User Object
    const newUser = new User({
      name,
      lastName,
      email,
      password
    });
    
    // checking for roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();
    console.log(savedUser)
    // Create a token
    const token = jwt.sign({ id: savedUser._id }, SECRET_JWT, {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message);
  }
};

export const signinHandler = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Invalid Password",
      });

    const token = jwt.sign({ id: userFound._id }, SECRET_JWT, {
      expiresIn: 86400, // 24 hours
    });

    res.json({ token });
  } catch (error) {
    console.log(error);
  }
};

export const googleCallback=(req,res)=>{
  passport.authenticate("google", {
  successRedirect: "/login/logSuccess",
  failureRedirect: "/login/failed",
})
}

export const logSuccess= (req,res)=>{
  res.send("hola")
}

export const logFailed=(req,res)=>{
  res.status(401).json({
  error: true,
  message: "Log in failure",
});
}