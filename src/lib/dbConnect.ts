import mongoose from 'mongoose';

let isConnected = false;

async function dbConnect(): Promise<void> {
    if (isConnected) {
        console.log('Already connected to the database');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        isConnected = true;
        console.log('Database connected successfully');
    } 
    catch (error) {
        console.error('Database connection failed:', error);
    }
}

export default dbConnect;