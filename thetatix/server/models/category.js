const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    //completar
    categoryName: {
        type:String,
        required: true
    },
    categoryDescription: {
        type: String,
        required: false
    },
    img: {
        type: Buffer
    } // temporal
})

const Category = mongoose.model('category',categorySchema);
export default Category;
