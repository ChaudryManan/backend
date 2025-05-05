
import mongoose  from "mongoose";
import  {DB_Name}  from "../constants.js";
import 'dotenv/config';
const connectDB=async()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log("mongodb is connected with server")
    }
    catch(error){
console.log("mongodb is not connecting with database",error)
    }

}
connectDB()
export default connectDB;