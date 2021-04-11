const mongoose = require('mongoose')
const Schema = mongoose.Schema
var moment = require('moment');
var now = moment();

const loginSchema = new Schema({

    loginAt: {
        type: String, default: now.format('YYYY/MM/DD')
    },
    logoutAt: {
        type: String, default: now.format('YYYY/MM/DD')
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('login', loginSchema)