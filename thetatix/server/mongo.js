const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = "thetatix_db";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connectToDatabase() {
  try {
    console.log("Awaiting connection");
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to connect to MongoDB");
  }
}

module.exports = { connectToDatabase };
