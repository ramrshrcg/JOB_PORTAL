import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    // await mongoose.connect("mongodb://localhost:27017/");
    // await mongoose.connect('mongodb://127.0.0.1:27017/test')

    // mongodb+srv://ramrshrcg:<db_password>@cluster0.s1mmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

    console.log("Data base connected sucessfully");
  } catch (error) {
    console.error(error);
  }
};
export default connectDB;
