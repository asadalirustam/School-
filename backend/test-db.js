const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://asadalirustam9_db_user:asadali456@cluster0.7ktiiem.mongodb.net/School?retryWrites=true&w=majority&appName=Cluster0";

console.log("Attempting to connect to MongoDB Atlas...");

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("SUCCESS: Connected to database successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILURE: Database connection failed!");
    console.error("Error Details:", err.message);
    process.exit(1);
  });
