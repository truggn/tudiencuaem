
const User = require('../model/user')
const hashPasswordByArgon2 = require('argon2')
const jwt = require('jsonwebtoken')
const _CONF = require('../config/secret')

class userController {

    // POST REGISTER
    async createPost(req, res, next) {
        const { username, email, password } = req.body

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền username."
            })
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền Email."
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền Password."
            })
        }
        try {
            const checkusername = await User.findOne({ username: username })
            if (checkusername) {
                return res.status(400).json({
                    success: false,
                    message: "username này đã được dùng."
                })
            }
            const checkemail = await User.findOne({ email: email })
            if (checkemail) {
                return res.status(400).json({
                    success: false,
                    message: "email này đã được dùng."
                })
            }
            const hashPassword = await hashPasswordByArgon2.hash(password)

            const newAcount = new User({
                username: username,
                email: email,
                password: hashPassword
            })
            const data = await newAcount.save()
            return res.json({
                success: true,
                data: data,
                message: 'Đăng ký thành công',
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: " Internal Server Error"
            })
        }

    };
    //POST login
    async loginPage(req, res, next) {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập Email"
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập Password"
            })
        }
        try {
            //check user 
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: 'Người dùng này không tồn tại.'
                })
            }
            const passwordValidate = await hashPasswordByArgon2.verify(user.password, password)
            if (!passwordValidate) {
                return res.status(400).json({
                    success: false,
                    message: 'Sai mật khẩu.'
                })
            }
            const token = jwt.sign({ userId: user._id }, _CONF.secret)// , { expiresIn: _CONF.tokenLife }
            user.token = token
            await user.save()
            return res.json({
                success: true,
                message: 'Đăng nhập thành công',
                token: token
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: " Internal Server Error"
            })
        }
    }

}
module.exports = new userController