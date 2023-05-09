const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String, 
        required: true,
        unique: true
    }
})

const User = mongoose.models.user || mongoose.model('user',userSchema);
export default User;
