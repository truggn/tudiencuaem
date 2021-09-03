const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

// @ PATCH UPDATE PASSWORD 
route.put('/update-password', auth, userController.updatePassword)
// @ PUT UPDATE ACOUNT -> { không có cập nhật mật khẩu và email trong router này}
route.put('/update-acount', auth, upload.single('avata'), userController.updateAcount)
// @ PUT ACTIVE ACCOUNT 
route.put('/activated-account', userController.activatedAccount)


module.exports = route