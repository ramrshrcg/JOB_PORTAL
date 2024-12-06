import mongoose from "mongoose";


const connectDB= async()=>
{
     try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Data base connected sucessfully")
     } catch (error) {
        console.error(error);
        
     }
}
export default connectDB


