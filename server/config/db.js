import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempting to connect to MongoDB URI provided in the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Console logs for successful connection as requested
    console.log(`MongoDB Connected successfully!`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    // Proper error handling
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // Exit process with failure in case of connection error (Production ready practice)
    process.exit(1);
  }
};

export default connectDB;
