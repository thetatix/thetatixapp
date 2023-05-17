const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryNumber: {
        type: Number,
        required: true
    },
    categoryName: {
        type:String,
        required: true
    },
    img: {
        type: Buffer
    } // temporal
}, { collection: 'categories' });

const Category = mongoose.models.category || mongoose.model('category',categorySchema);
export default Category;
