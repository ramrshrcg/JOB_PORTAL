//import
import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
//import
import connectDB from "./config/mongodb.js";
import userModel from "./models/userModel.js";
// import errorMiddleware from "./middleware/errorMiddleware.js";
import userAuth from "./middleware/userAuth.js";
import jobModel from "./models/jobModel.js";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
// app.use(cors());
// app.use(errorMiddleware);
// app.use(hashPassword(userModel.password))

const PORT = process.env.PORT;
app.get("/", userAuth, (req, res) => {
  res.send("<h1welcome to job portal</h1>");
});

//user
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
    //token
    const token = User.createJWT(); //i dont think it makes any sense
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
  console.log(user.password);

  const isMatch = await user.comparePassword(password);
  // console.log(isMatch);
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
  const { name, email, lastName, phoneNo, password } = req.body;

  const user = await userModel.findOne({ _id: req.user.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (lastName) user.lastName = lastName;
  if (phoneNo) user.phoneNo = phoneNo;
  if (password) user.password = password;

  await user.save();
  const token = user.createJWT();
  // console.log(user);

  res.status(200).json({
    message: "sucessful",
    user,
    token,
  });
});

// app.get("/protected", userAuth, (req, res) => {
//   // req.user contains { userId: '...' }
//   console.log(req.user.userId);
//   res.status(200).json({ message: "Access granted" });
// });

//job

app.post("/createjobs", userAuth, async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }

  req.body.createdBy = req.user.userId;

  const job = await jobModel.create(req.body);
  res.status(200).json({ message: "job created sucessfully", job });
});

app.get("/getjobs", userAuth, async (req, res) => {
  const jobs = await jobModel.find();

  res.status(200).json({
    totoalJobs: jobs.length,
    message: "jobs fetched sucessfully",
    jobs,
  });
});

app.patch("/update_job/:id", userAuth, async (req, res) => {
  const id = req.params.id;
  const { company, position } = req.body;
  if (!company || !position) {
    res.status(400).json({ message: "send all the parameters" });
  }
  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    res.status(400).json({
      message: `no job found with this ${id}`,
    });
  }

  if (!req.user.userId === job.createdBy.toString()) {
    res.status(400).json({
      message: "you are not authorized to update this job",
    });
  }
  const updatejob = await jobModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ message: "job updated sucessfully", updatejob });
});

app.delete("/delete_job/:id", userAuth, async (req, res) => {
  // const id =req.params.id;
  // jobModel.findByIdAndDelete(id).then((result)=>
  //   {
  //     res.status(200).json({message:"job deleted sucessfully"})
  //     }).catch((err)=>
  //       {
  //         res.status(400).json({message:err})
  //         })

  const { id } = req.params;
  const job = await jobModel.findOne({ _id: id });

  if (!job) {
    res.status(400).json({
      message: `no job found  with ${id}`,
    });
  }
  if (!req.params.userId===job.createdBy.toString())
  {
    res.status(400).json({
      message:"U cannot delete this job"
    })
  }

  await job.deleteOne();
  res.status(200).json({
    message: "Job deleted",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on ${process.env.DEV_MODE} port ${PORT}`);
});
