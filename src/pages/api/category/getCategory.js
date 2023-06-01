import connectMongo from '@/server/mongo';
import Category from '@/server/models/category';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const categoryId = req.query.categoryId;
            // connect to MongoDB
            await connectMongo();
            // find all events and return them
            const category = await Category.find({ _id: categoryId });
            // const categories = await Category.find().exec();
            if (category.length === 0) {
              res.status(404).json({ message: "This category does not exist." });
            } else {
              res.status(200).json(category);
            }
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Unable to fetch category." });
          }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default handler;
