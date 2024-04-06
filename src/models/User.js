import { Schema,model } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema= new Schema({
    name: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email: {
    type: String,
    unique: true,
    },
    password: {
    type: String,
    },
    codPostal:{
        type: String,
    },
    state:{
        type: String,
    },
    city:{
        type: String,
    },
    adress:{
        type: String,
    },
    apartment:{
        type: String,
    },
    roles: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
    },
    ],
},{
    timestamps: true,
    versionKey: false,
  }
);

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  
  userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
  }
  
  userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  })
  

export default model("User",userSchema);