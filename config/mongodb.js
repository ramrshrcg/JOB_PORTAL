import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    // await mongoose.connect("mongodb://localhost:27017/jobportal");

    console.log("Data base connected sucessfully");
  } catch (error) {
    console.error(error);
  }
};
export default connectDB;
