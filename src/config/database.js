import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected at ${connectionInstance.connection.host}`);
    } catch ( error ){
        console.log(`Database connection: Failed`);
    }
}

export default connectDB;