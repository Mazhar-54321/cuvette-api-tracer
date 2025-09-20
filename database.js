import mongoose from 'mongoose';

const database = async () => {
  try {
    const DATABASE ='mongodb+srv://test:test@demo.aoloa.mongodb.net/express?retryWrites=true&w=majority';
    await mongoose.connect(DATABASE);
    console.info('Connected to the database.');
  } catch (error) {
    console.error('Could not connect to the database.', error);
  }
};
export default database;
