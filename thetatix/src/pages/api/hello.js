import User from "@/server/models/usuario";
import connectMongo from "@/server/mongo";

export default async function handler(req, res) {
  console.log('CONNECTING TO MONGO');
  await connectMongo();
  console.log('CONNECTED TO MONGO');
  const user = await User.create({walletAddress:"jdhkjfdjhfhjhkfdgddfdfs"})
  console.log(user)
  res.status(200).json(user)
}