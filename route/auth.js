const express = require('express')
const userController = require('../controller/userController')
const route = express.Router()
const auth = require('../middleware/auth')
const User = require('../model/users')
const upload = require('../middleware/upload')


// @route POST api/auth/register
// @descri  Register user
// @access public 
route.post('/register', upload.single('avata'), userController.createAcount)

// @route POST api/auth/login
// @descri  login acount
// @access public 
route.post('/login', userController.loginPage)



//@route get api/auth 
//@desc check if user is login
//@access public 
route.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(400).json({ success: false, message: 'User not found' })
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: " Internal Server Error"
        })
    }
})

module.exports = route