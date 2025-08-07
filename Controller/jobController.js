import jobModel from "../models/jobModel.js";

class jobController {
  static async createJob(req, res, next) {
    try {
      const { company, position } = req.body;
      if (!company || !position) {
        next("Please Provide All  Fields");
      }

      req.body.createdBy = req.user.userId;

      const job = await jobModel.create(req.body);
      res.status(200).json({ message: "job created sucessfully", job });
    } catch (error) {
      next(error);
    }
  }

  static async viewJobs(req, res, next) {
    try {
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
    } catch (error) {
      next(error);
    }
  }

  static async allJobs(req, res, next) {
    try {
      const jobs = await jobModel.find();
      res.status(200).json({ message: "All jobs fetched successfully", jobs });
    } catch (error) {
      next(error);
    }
  }

  static async updateJob(req, res, next) {
    try {
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

      if (!req.user.userId === job?.createdBy.toString()) {
        res.status(400).json({
          message: "you are not authorized to update this job",
        });
      }
      const updatejob = await jobModel.findByIdAndUpdate(
        { _id: id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({ message: "job updated sucessfully", updatejob });
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(req, res, next) {
    try {
      const { id } = req.params;
      const job = await jobModel.findOne({ _id: id });

      if (!job) {
        res.status(400).json({
          message: `no job found  with ${id}`,
        });
      }
      if (!req.params.userId === job?.createdBy.toString()) {
        res.status(400).json({
          message: "U cannot delete this job",
        });
      }

      await job.deleteOne();
      res.status(200).json({
        message: "Job deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async jobStatsFilter(req, res, next) {
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
  }
}

export default jobController;
