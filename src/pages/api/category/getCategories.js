import connectMongo from '@/server/mongo';
import Category from '@/server/models/category';

const handler = async (req, res) => {
  try {
    // connect to MongoDB
    await connectMongo();
    // find all events and return them
    const categories = await Category.find({}, { img: 0 }).sort({ categoryNumber: 1 }).exec();
    if (categories.length === 0) {
      // Handle case where no events were found
      // For example, return an error message
      res.status(404).json({ message: "No categories were found." });
    } else {
      // Return the events
      res.status(200).json(categories);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch categories." });
  }
};

export default handler;
