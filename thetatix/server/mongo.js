const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "thetatixdb";

async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    console.log("Connected to MongoDB");

    // Make the appropriate DB calls
    const db = client.db(DB_NAME);
    return db;
  } catch (e) {
    console.error(e);
    throw new Error("Unable to connect to MongoDB");
  }
}

module.exports = { connectToDatabase };
