//import
import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
//import
import connectDB from "./config/mongodb.js";
import userModel from "./models/userModel.js";
// import errorMiddleware from "./middleware/errorMiddleware.js";
import userAuth from "./middleware/userAuth.js";
import jobModel from "./models/jobModel.js";
// import mongoose from "mongoose";
import moment from "moment/moment.js";
//import routes
import home from "./Routes/home.js";
import {loginRoute, registerRoute, updateRoute} from "./Routes/userRoute.js";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(cors());
// app.use(errorMiddleware);
// app.use(hashPassword(userModel.password))

const PORT = process.env.PORT || 8080;
//home
app.use('/',home)

//user
app.use("/user", registerRoute)
app.use('user', loginRoute);
app.use('user', updateRoute);


//job routes

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


app.post("/createjobs", userAuth, async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }

  req.body.createdBy = req.user.userId;

  const job = await jobModel.create(req.body);
  res.status(200).json({ message: "job created sucessfully", job });
});

app.get("/getalljobs", async (req, res) => {
  //search by query
  const { status, workType, search, sort } = req.query;

  // const queryObject = {
  //   createdBy: req.user.userId,
  // };

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = await jobModel.find(queryObject);

  if (sort === "latest") {
    queryResult = queryResult.sort((a, b) => b.createdAt - a.createdAt);
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort((a, b) => a.createdAt - b.createdAt);
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort((a, b) =>
      a.position.localeCompare(b.position)
    );
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort((a, b) =>
      b.position.localeCompare(a.position)
    );
  }

  const jobs = queryResult;

  // const jobs = await jobModel.find();

  res.status(200).json({
    totoalJobs: jobs.length,
    message: "jobs fetched sucessfully",
    jobs,
  });
});
app.get("/getjobs", userAuth, async (req, res) => {
  //search by query
  const { status, workType, search, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = await jobModel.find(queryObject);

  if (sort === "latest") {
    queryResult = queryResult.sort((a, b) => b.createdAt - a.createdAt);
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort((a, b) => a.createdAt - b.createdAt);
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort((a, b) =>
      a.position.localeCompare(b.position)
    );
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort((a, b) =>
      b.position.localeCompare(a.position)
    );
  }

  const jobs = queryResult;

  // const jobs = await jobModel.find();

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
  if (!req.params.userId === job.createdBy.toString()) {
    res.status(400).json({
      message: "U cannot delete this job",
    });
  }

  await job.deleteOne();
  res.status(200).json({
    message: "Job deleted",
  });
});

app.get("/job_stats", userAuth, async (req, res) => {
  const stats = await jobModel.aggregate([
    {
      $match: {
        createdBy: req.user.userId.toString,
      },
    },
    {
      $group: {
        _id: "$workType",
        company: { $push: "$company" },
      },
    },
  ]);

  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  let monthlyStats = await jobModel.aggregate([
    {
      $match: {
        createdBy: req.user.userId.toString,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  monthlyStats = monthlyStats
    .map((items) => {
      const {
        _id: { year, month },
        count,
      } = items;
      const date = moment(`${year}-${month}`, "YYYY-MM").format("YYYY-MM");
      return { date, count };
    })
    .reverse();
  res.status(200).json({
    totlaJob: stats.length,

    //  defaultStats,
    // monthlyStats,
    stats,
  });
});

app.get("/job_stats_filter", userAuth, async (req, res) => {
  try {
    // const { jobType } = req.query; // Retrieve jobType from query parameters
    const jobType = "full-time";
    const createdBy = req.user.userId;
    // console.log(jobType,createdBy);

    // Aggregation pipeline
    const jobs = await jobModel.aggregate([
      {
        $match: {
          createdBy: createdBy.toString,
          workType: jobType, // Filter jobs by jobType
        },
      },
      {
        $project: {
          _id: "$company",
          // jobType: "$workType",
          position: "$position",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      message: `Jobs of type  fetched successfully`,
      totlaJob: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
