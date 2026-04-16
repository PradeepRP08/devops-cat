import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
    if (!mongoUri) {
        throw new Error("Set MONGO_URI (or MONGODB_URI) in server/.env");
    }
    mongoose.connection.on("connected", () => console.log("database connected"));

    await mongoose.connect(mongoUri);
};

export default connectDB