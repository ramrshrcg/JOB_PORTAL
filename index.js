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
app.get("/", userAuth, (req, res) => {
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
  user.password = undefined; // it is done to hide password from log to make secure
  const token = user.createJWT();
  res.status(200).json({
    message: "Login Sucessful ",
    user,
    token,
  });
});
/*
app.put("/update", userAuth, async (req, res) => {
  const { email, name, lastName, phoneNo } = req.body;
  try {
     const user = await userModel.findOne({ _id: req.user.userId });
    // const user = await userModel.find();
    

    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields conditionally

    

    // if (password) {
    //   user.password = await bcrypt.hash(password, 10);
    //   }
    await user.save();
    const token = user.createJWT();
    res.status(200).json({ message: "User updated successfully", user, token });
  } catch {
    res.status(400).json({ message: "Error in updating user" });
  }
});

*/

app.put("/update", userAuth, async (req, res) => {
  //can update by searching name
  const { name, newname, email, lastName, phoneNo } = req.body;
  const user = await userModel.findOne({ name });
  // const user = await userModel.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //update
  if (newname) {
    user.name = newname;
  }
  if (email) user.email = email;
  if (lastName) user.lastName = lastName;
  if (phoneNo) user.phoneNo = phoneNo;

  await user.save();
  const token = user.createJWT()

  res.status(200).json({
    message:"sucessful",
    user, token
  })
})

app.listen(PORT, () => {
  console.log(`server is running on ${process.env.DEV_MODE} port ${PORT}`);
});
