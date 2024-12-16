import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      requied: [true, "Companay name is require"],
    },
    position: {
      type: String,
      required: [true, "Job Position is required"],
    },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contaract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Dharan",
      required: [true, "Work location is required"],
    },
    createdBy: {
        //how to get created by 
            type: mongoose.Schema.Types.ObjectId, // References the User model
            ref: "User", // Name of the User model
            // required: [ "Job must have a creator"],
         

    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);