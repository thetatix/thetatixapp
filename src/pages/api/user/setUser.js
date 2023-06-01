import connectMongo from '@/server/mongo';
import User from '@/server/models/user';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await connectMongo();
            const { data } = req.body;
            const { walletAddress, username } = data;

            let user = await User.findOne({ walletAddress });

            if (user) {
                if (user.walletAddress !== walletAddress) {
                    res.status(406).json({ data: null, message: 'Username already taken' });
                }
                // User already exists, update the username
                const statusMsg = 'Username changed successfully from ' + user.username + ' to ' + username + '.';
                user.username = username;
                await user.save();
                res.status(200).json({ data: user, message: statusMsg });
            } else {
                // User does not exist, create a new user
                user = new User({
                    walletAddress,
                    username,
                });
                const statusMsg = 'Username changed successfully as ' + username + '.';
                await user.save();
                res.status(200).json({ data: user, message: statusMsg });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Unable to set your username.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

export default handler;