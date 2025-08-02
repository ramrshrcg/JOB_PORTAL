//import packages
import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import moment from "moment/moment.js";

//import configs
import connectDB from "./config/mongodb.js";

// import errorMiddleware from "./middleware/errorMiddleware.js";
import userAuth from "./middleware/userAuth.js";
import jobModel from "./models/jobModel.js";

//import routes
import home from "./Routes/home.js";
import { loginRoute, registerRoute, updateRoute } from "./Routes/userRoute.js";
import { allJobs, createJob, deleteJob,  jobStatsFilter, updateJob, viewJob} from "./Routes/jobRoutes.js";

dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use(cors());
// app.use(errorMiddleware);
// app.use(hashPassword(userModel.password))

const PORT = process.env.PORT || 8080;

//home route
app.use("/", home);

//user routes
app.use("/user", registerRoute);
app.use("user", loginRoute);
app.use("user", updateRoute);

//job routes
app.use('/job',createJob)
app.use('/job', viewJob);
app.use('/job', allJobs);
app.use('/job', updateJob);
app.use('/job', deleteJob);
app.use('/job', jobStatsFilter);



//   // const id =req.params.id;
//   // jobModel.findByIdAndDelete(id).then((result)=>
//   //   {
//   //     res.status(200).json({message:"job deleted sucessfully"})
//   //     }).catch((err)=>
//   //       {
//   //         res.status(400).json({message:err})
//   //         })

//   const { id } = req.params;
//   const job = await jobModel.findOne({ _id: id });

//   if (!job) {
//     res.status(400).json({
//       message: `no job found  with ${id}`,
//     });
//   }
//   if (!req.params.userId === job.createdBy.toString()) {
//     res.status(400).json({
//       message: "U cannot delete this job",
//     });
//   }

//   await job.deleteOne();
//   res.status(200).json({
//     message: "Job deleted",
//   });
// });

// app.get("/job_stats", userAuth, async (req, res) => {
//   const stats = await jobModel.aggregate([
//     {
//       $match: {
//         createdBy: req.user.userId.toString,
//       },
//     },
//     {
//       $group: {
//         _id: "$workType",
//         company: { $push: "$company" },
//       },
//     },
//   ]);

//   const defaultStats = {
//     pending: stats.pending || 0,
//     reject: stats.reject || 0,
//     interview: stats.interview || 0,
//   };

//   let monthlyStats = await jobModel.aggregate([
//     {
//       $match: {
//         createdBy: req.user.userId.toString,
//       },
//     },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$createdAt" },
//           month: { $month: "$createdAt" },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);
//   monthlyStats = monthlyStats
//     .map((items) => {
//       const {
//         _id: { year, month },
//         count,
//       } = items;
//       const date = moment(`${year}-${month}`, "YYYY-MM").format("YYYY-MM");
//       return { date, count };
//     })
//     .reverse();
//   res.status(200).json({
//     totlaJob: stats.length,

//     //  defaultStats,
//     // monthlyStats,
//     stats,
//   });
// });

// app.get("/job_stats_filter", userAuth, async (req, res) => {
//   try {
//     // const { jobType } = req.query; // Retrieve jobType from query parameters
//     const jobType = "full-time";
//     const createdBy = req.user.userId;
//     // console.log(jobType,createdBy);

//     // Aggregation pipeline
//     const jobs = await jobModel.aggregate([
//       {
//         $match: {
//           createdBy: createdBy.toString,
//           workType: jobType, // Filter jobs by jobType
//         },
//       },
//       {
//         $project: {
//           _id: "$company",
//           // jobType: "$workType",
//           position: "$position",
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     res.status(200).json({
//       message: `Jobs of type  fetched successfully`,
//       totlaJob: jobs.length,
//       jobs,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching jobs", error });
//   }
// });

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
