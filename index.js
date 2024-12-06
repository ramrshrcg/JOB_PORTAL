//import
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import
import connectDB from "./config/mongodb.js";
import userModel from "./models/userModel.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(cors());
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
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
    const User = await userModel.create({ name, email, password });
    res.send({ message: "User created sucessfully", User });
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on ${process.env.DEV_MODE} port ${PORT}`);
});
