const mongoose = require('mongoose')
const Schema = mongoose.Schema
var moment = require('moment'); // require
var now = moment();

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
    },
    status: {
        type: String,
        enum: ['NOOP', 'OK'],// trạng thái chờ xác nhận [NOOP] , // Trạng thái đã xác nhận [OK]
        default: 'NOOP'
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    speciesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'speciesposts'
    }],
    deleteAt: { type: String, default: now.format('YYYY/MM/DD') },
    createAt: { type: String, default: now.format('YYYY/MM/DD') },
    updateAt: { type: String, default: now.format('YYYY/MM/DD') },


}, {
    timestamps: false,
})
module.exports = mongoose.model('Post', postSchema)