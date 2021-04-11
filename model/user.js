const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: {
        type: String
    },
    deleteAt: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    action: { type: String, default: 'System' },

})
module.exports = mongoose.model('User', userSchema)