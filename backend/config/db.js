import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`Mongodb connected: ${res.connection.host}`.cyan.underline);
  } catch (e) {
    console.error(`Error: ${e.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
