import express from "express";
import jobController from "../Controller/jobController.js";
import userAuth from "../middleware/userAuth.js";
const router = express.Router();

const createJob=router.post('/createjobs', userAuth, jobController.createJob)
const viewJob=router.get('/viewJob',userAuth, jobController.viewJobs)
const allJobs=router.get('/allJobs', jobController.allJobs)
const updateJob=router.patch('/updateJob/:id', userAuth, jobController.updateJob)
const deleteJob = router.delete('/deleteJob/:id', userAuth, jobController.deleteJob)
const jobStatsFilter= router.get('/jobStatsFilter',userAuth, jobController.jobStatsFilter)


export  {createJob,  viewJob, allJobs, updateJob, deleteJob, jobStatsFilter};