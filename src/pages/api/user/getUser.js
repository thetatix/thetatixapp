import connectMongo from '@/server/mongo';
import User from '@/server/models/user';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { walletAddress } = req.query;
      await connectMongo();
      const user = await User.findOne({ walletAddress: walletAddress });
      if (!user) {
        res.status(404).json({ user: null, message: 'User not found.' });
      }
      res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Unable to fetch user.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};

export default handler;
