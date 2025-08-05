import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
   
    console.log("Data base connected sucessfully");
    return
  } catch (error) {
    console.error(error);
    return
  }
};
export default connectDB;
