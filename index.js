//import
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import
import connectDB from "./config/mongodb.js";
import userModel from "./models/userModel.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import userAuth from "./middleware/userAuth.js";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(cors());
app.use(errorMiddleware);
// app.use(hashPassword(userModel.password))

const PORT = process.env.PORT;
app.get("/",userAuth,(req, res) => {
  res.send("<h1welcome to job portal</h1>");
});

app.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // check if nanem enmail or password is entered or not
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    //check if email is already existed
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        message: "Email already existed.",
      });
    }
    //hash password
    const User = await userModel.create({ name, email, password });
    //token
    const token = User.createJWT();
    res.send({ message: "User created sucessfully", User, token });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send({ message: "Enter email and password" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "wrong email" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(400).json({ message: "wrong password" });
  }
  user.password= undefined// it is done to hide password from log to make secure
  const token = user.createJWT()
  res.status(200).json({  
    message:"Login Sucessful ",
    user,
    token,
  })
});

app.listen(PORT, () => {
  console.log(`server is running on ${process.env.DEV_MODE} port ${PORT}`);
});
