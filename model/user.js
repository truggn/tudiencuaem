const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
    isLockAcount: {
        type: Boolean,
        default: 'false' // neu tai khoan bi block -> reset isLockAcount is 'true'
    },
    // status: {
    //     type: Boolean,
    //     default: 'false'  // if user login -> reset status is 'true' 'sẽ là đang hoạt động'
    // },
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: {
        type: String
    },
    deleteAt: { type: Date, default: null },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: null },
    action: { type: String, default: 'System' },

})
module.exports = mongoose.model('User', userSchema)