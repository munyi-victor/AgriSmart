import mongoose from "mongoose";

const connectDB = async () => {
  const uri = String(process.env.MONGODB_URI);
  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
