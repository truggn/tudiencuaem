const express = require('express')
const adminController = require('../controller/adminController')
const route = express.Router()
const auth = require('../middleware/auth')


// @ PUT KHÓA ACOUNT
route.patch('/lock-acount/:id', auth, adminController.lockAcount)
// @ PATCH MỞ TÀI KHOẢN 
route.patch('/open-acount/:id', auth, adminController.openAcount)
// @ PATCH EXECUTED STATUS POSTS ->[OK]
route.patch('/executed-post/:id', auth, adminController.executedPost)
// @ PATCH BLOCK STATUS POSTS ->[NOOP]
route.patch('/block-post/:id', auth, adminController.blockPosts)
// @ DELETE FOREVER POSTS
route.delete('/destroy-post/:id', auth, adminController.destroyPosts)


module.exports = route