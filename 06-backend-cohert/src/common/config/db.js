import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\n MongoDB Connected! DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("\n MongoDB Connection FAILED:", error);

    // Instead of killing the app here, we throw the error back to whoever called this function
    throw error;
  }
};

export default connectDB;
