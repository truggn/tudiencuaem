const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TypePostSchema = new Schema({
    types: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('typepost', TypePostSchema)