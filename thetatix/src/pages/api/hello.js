// import { initialize } from "@/server/mongo";

// export default async function handler(req, res) {
//   const db = await initialize();
//   const collection = db.collection("test");
//   const result = await collection.insertOne({ hello: "world" });
//   res.status(200).json({ message: "Inserted document with _id: " + result.insertedId });
// }


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}