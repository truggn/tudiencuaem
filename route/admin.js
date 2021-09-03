const express = require('express')
const adminController = require('../controller/adminController')
const route = express.Router()
const auth = require('../middleware/auth')


// @ PUT KHÓA ACOUNT
route.put('/lock-account/:id', auth, adminController.lockAcount)
// @ PATCH MỞ TÀI KHOẢN 
route.put('/unlock-account/:id', auth, adminController.openAcount)
// @ DELETE FOREVER POSTS
route.delete('/destroy-post/:id', auth, adminController.destroyPosts)


module.exports = route