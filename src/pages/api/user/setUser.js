import connectMongo from '@/server/mongo';
import User from '@/server/models/user';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await connectMongo();
            const { data } = req.body;
            const { walletAddress, username } = data;

            let my_user = await User.findOne({ walletAddress });
            const user = await User.findOne({ username });

            if (user) {
                res.status(406).json({ data: null, message: 'Username already taken.' });
            } else {
                if (my_user) {
                    const statusMsg = 'Username changed successfully from ' + my_user.username + ' to ' + username + '.';
                    my_user.username = username;
                    await my_user.save();
                    res.status(200).json({ data: my_user, message: statusMsg });
                }
                // User does not exist, create a new user
                const new_user = new User({
                    walletAddress,
                    username,
                });
                const statusMsg = 'Username changed successfully as ' + username + '.';
                await new_user.save();
                res.status(200).json({ data: new_user, message: statusMsg });
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