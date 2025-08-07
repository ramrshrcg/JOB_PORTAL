import express from "express";
import jobController from "../Controller/jobController.js";
import userAuth from "../middleware/userAuth.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
const router = express.Router();

const createJob=router.post('/createjobs', userAuth, jobController.createJob, errorMiddleware)
const viewJob=router.get('/viewJob',userAuth, jobController.viewJobs, errorMiddleware)
const allJobs=router.get('/allJobs', jobController.allJobs, errorMiddleware)
const updateJob=router.patch('/updateJob/:id', userAuth, jobController.updateJob, errorMiddleware)
const deleteJob = router.delete('/deleteJob/:id', userAuth, jobController.deleteJob, errorMiddleware)
const jobStatsFilter= router.get('/jobStatsFilter',userAuth, jobController.jobStatsFilter, errorMiddleware)


export  {createJob,  viewJob, allJobs, updateJob, deleteJob, jobStatsFilter};