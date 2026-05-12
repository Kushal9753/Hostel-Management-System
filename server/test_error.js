import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './models/Room.js';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const room = await Room.create({
      roomNumber: 'TEST-' + Date.now(),
      block: 'TEST',
      floor: 1,
      capacity: 2
    });

    console.log('Created room successfully:', room);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    mongoose.connection.close();
  }
};

test();
