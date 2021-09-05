const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

const commentSchema = new Schema({
    content: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: false,
})
module.exports = mongoose.model('comments', commentSchema)