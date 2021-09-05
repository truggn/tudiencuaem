const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        default: 0
    },
    disklike: {
        type: Number,
        default: 0
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        content: {
            type: String
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    typePostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'typepost'
    },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
}, {
    timestamps: false,
})
module.exports = mongoose.model('Posts', postSchema)