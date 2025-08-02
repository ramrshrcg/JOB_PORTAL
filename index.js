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



app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
