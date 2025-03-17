import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async () =>{
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected successfully.")
    } catch (error) {
        console.error("Error connect to MongoDB.");
        process.exit(1);
    }
}
export default connectDatabase;