import { connectToDatabase } from "@/server/mongo"

export default async function handler(req, res) {
  try {
    console.log("Start events.js");
    const db = await connectToDatabase();
    console.log("Getting collection events");
    const eventCollection = db.collection("events");
    const events = await eventCollection.find({}).toArray();
    res.status(200).json(events);
    console.log("Fetched events");
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch events." });
  }
}
