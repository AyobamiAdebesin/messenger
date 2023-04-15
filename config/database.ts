import mongoose, { ConnectOptions } from "mongoose";

// Connect to MongoDB

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};


