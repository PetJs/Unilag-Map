import mongoose from 'mongoose';

// MongoDB connection string with the database name (replace <password> with your actual password)
const mongoURI = 'mongodb+srv://PetJs:Ademide1@unilagmap.fklft.mongodb.net/unilagMapDatabase?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  connectTimeoutMS: 30000,  // 30 seconds timeout
  socketTimeoutMS: 45000,   // 45 seconds for socket timeout
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Get the connection instance
const database = mongoose.connection;

// Handle connection events
database.on('error', console.error.bind(console, 'MongoDB connection error:'));
database.once('open', () => {
  console.log('MongoDB connected successfully!');
});

export default database;
