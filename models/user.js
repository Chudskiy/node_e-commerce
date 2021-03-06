const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
        name: String,
        email: {
            type: String,
            required: true,
            index: true,
        },
        role: {
            type: String,
            default: 'subscribe',
        },
        cart: {
            type: Array,
            default: [],
        },
        address: String,
        // whishlist: [{type: Object, ref: 'Product'}],
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);
