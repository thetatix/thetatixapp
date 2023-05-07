import { connectToDatabase } from '@/server/mongo';

export async function getAllUsers() {
  const db = await connectToDatabase();
  const collection = db.collection('users');
  const users = await collection.find({}).toArray();
  return users;
}
