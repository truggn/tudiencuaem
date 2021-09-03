
const User = require('../model/users')
const hashPasswordByArgon2 = require('argon2')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const nodemailer = require('nodemailer')
const validator = require('validator')
const passwordvalidator = require('password-validator')
const Login = require('../model/login')
let moment = require('moment');
let now = moment();

// cau hinh clound
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// validator password
const passSchema = new passwordvalidator();
const passMinLen = 6;
const passMaxLen = 18;

passSchema
    .is().min(passMinLen)
    .is().max(passMaxLen)
    .has().letters()
    .has().digits();

class userController {

    //@method POST [REGISTER Acount]
    async createAcount(req, res) {
        const { username, email, password } = req.body
        const file_avata = req.file.path
        const htmlEmail = (codeactivate)=>{
            return ` 
           Cảm ơn bạn đã đồng hành cùng chúng tôi, mã code kích hoạt tài khoản của bạn là:${codeactivate}. Chúc bạn một ngày tốt lành. Happy Nice Day. `;
        };
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền Username"
            })
        }
        if (username.includes('cặc') || username.includes('lồn')) {
            return res.status(400).json({
                success: false,
                message: "tên người dùng không hợp lệ."
            })
        }
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ."
            })
        }
        if (!password || !passSchema.validate(password)) {
            return res.status(400).json({
                success: false,
                message: "password không hợp lệ, tối thiểu 6-18 ký tự, bao gồm cả chữ và số."
            })
        }
        try {
            const checkUser = await User.findOne({ username: username})
            if (checkUser) {
                return res.status(400).json({
                    success: false,
                    message: "Tên người dùng đã tồn tại"
                })
            }
            const checkEmail = await User.findOne({ email: email})
            if (checkEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email đã được đăng ký"
                })
            }
            const url_avata = await cloudinary.uploader.upload(file_avata,(error, result)=>{
                if(error) return error.message
                if(result) return result
                return 'Unknow Error'
            })
            const hashPassword = await hashPasswordByArgon2.hash(password)
            const makecode = () => {
                let text = ""
                let data = process.env.MAKEID
                for(var i = 0 ; i < 6; i++){
                    text+=data.charAt(Math.floor(Math.random() * data.length))
                }
                return text;
            }
            const codeActive = makecode();
            const newAcount = new User({
                username: username,
                email: email,
                password: hashPassword,
                avata: url_avata.url,
                codeActive: codeActive
            })
            await newAcount.save()
            // đăng ký thành công sẽ gửi về email người dùng 1 thông báo và 1 code để kích hoạt tài khoản.
            let link = htmlEmail(codeActive)
            let mailTransposter = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user:process.env.EMAIL,
                    pass: process.env.PW
                }
            });
            let mailDetail = {
                from: process.env.EMAIL,
                to:email,
                subject:`CHÀO MỪNG BẠN ĐẾN VỚI WEBSITE libaryforme.com`,
                text:link
            };
            await mailTransposter.sendMail(mailDetail, (error, success)=>{
                if(error){ 
                    console.log(error.message);
                    return error.message
                }else{
                    console.log('send email successfull')
                    return success
                }
            })
            return res.status(200).json({
                success: true,
                data: newAcount
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }

    };

    //@method POST [Login Acount]
    async loginPage(req, res, next) {
        const { email, password } = req.body
        const htmlEmail = (code)=>{
            return `Mã code để thực hiện mở khóa tài khoản của bạn là:${code} `;
        };
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập Email."
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập Mật khẩu."
            })
        }
        try {
            const user = await User.findOne({ email })    //check account users
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email hoặc Mật khẩu sai.'
                })
            }
            if (user.isLockAcount === true) {              // check lock account 
                return res.status(400).json({
                    success: false,
                    message: 'Tài khoản này hiện đang bị khóa.'
                })
            }
            const passwordValidate = await hashPasswordByArgon2.verify(user.password, password)
            if (!passwordValidate) {
                // kiểm tra người dùng login sai password quá 5 lần thì lock
                await User.findOneAndUpdate({email:email}, {isPasswordFailure:user.isPasswordFailure + 1 }, {new: true})
                if(user.isPasswordFailure >=4){
                    const makecode = () => {
                        let text = ""
                        let data = process.env.MAKEID
                        for(var i = 0 ; i < 6; i++){
                            text+=data.charAt(Math.floor(Math.random() * data.length))
                        }
                        return text;
                    }
                    const code = makecode();
                    await User.findOneAndUpdate({email:email},{
                        isLockAcount:true,
                        code: code
                    }, {new: true})
                    // sau đó send 1 thông báo về email người dùng.
                    let link = htmlEmail(code)
                    let mailTransposter = nodemailer.createTransport({
                        service: 'gmail',
                        auth:{
                            user:process.env.EMAIL,
                            pass: process.env.PW
                        }
                    });
                    let mailDetail = {
                        from: process.env.EMAIL,
                        to:email,
                        subject:'THỰC HIỆN KHÓA TÀI KHOẢN CỦA BẠN.',
                        text:link
                    };
                    await mailTransposter.sendMail(mailDetail, (error, success)=>{
                        if(error){ 
                            console.log(error);
                            return error.message
                        }else{
                            console.log('send email successfull')
                            return success
                        }
                    })
                }
                return res.status(400).json({
                    success: false,
                    message: 'Email hoặc Mật khẩu sai,chỉ nhập sai tối đa 5 lần.'
                })
            }
            else {
                const token = jwt.sign({ userId: user._id, role: user.roles }, process.env.TOKEN_SECRET)// , { expiresIn: process.env.TOKEN_LIFE }
                user.token = token
                await user.save()
                await Login.create({
                    loginAt: now,
                    logoutAt: null,
                    user: user._id
                })
                return res.status(200).json({
                    success: true,
                    token: token,
                    message: 'Đăng nhập thành công'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    };

    // @method PATCH [UPDATE PASSWORD USER] 
    async updatePassword(req, res) {
        const { oldPassword, newPassword } = req.body
        if (!oldPassword) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng nhập mật khẩu cũ.'
            })
        }
        if (!newPassword) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng nhập mật khẩu mới.'
            })
        }
        if (oldPassword === newPassword) {
            return res.status(401).json({
                success: false,
                message: 'Trùng mật khẩu cũ, vui lòng thử lại.'
            })
        }
        try {
            const acount = await User.findOne({ _id: req.userId })
            // check match password
            const verifyPassword = await hashPasswordByArgon2.verify(acount.password, oldPassword)
            if (verifyPassword) {
                const hassNewPassword = await hashPasswordByArgon2.hash(newPassword)
                await User.findOneAndUpdate({ _id: req.userId }, { password: hassNewPassword }, { new: true })
                return res.status(200).json({
                    success: true,
                    message: 'Cập nhật thành công.'
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Mật khẩu cũ không đúng.'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: error.message
            })
        }
    };

    //@ method PUT -> [ UPDATE ACOUNT USER]
    async updateAcount(req, res) {
        const {username} = req.body
        const file_avata = req.file.path
        // required
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền username."
            })
        }
        if (username.includes('lồn')) {
            return res.status(400).json({
                success: false,
                message: "tên người dùng không hợp lệ"
            })
        }
        if (username.includes('cặc')) {
            return res.status(400).json({
                success: false,
                message: "tên người dùng không hợp lệ"
            })
        }
        try {
            const url_avata = await cloudinary.uploader.upload(file_avata,(error, result)=>{
                if(error) return error.message
                if(result) return result
                return 'Unknow Error'
            })
            let newdataAcount = {
                username: username,
                avata: url_avata.url
            }
            const checkusername = await User.findOne({ username: username })
            if (checkusername) {
                return res.status(400).json({
                    success: false,
                    message: "username này đã tồn tại."
                })
            }
            const result = await User.findOneAndUpdate({ _id: req.userId }, newdataAcount, { new: true })
            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: "Posts not found with authorised.!!!"
                })
            } else {
                return res.status(500).json({
                    success: true,
                    data: result,
                    message: "Cập nhật thành công."
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    // @ method PUT -> Actived account
    async activatedAccount(req, res){
        const {code, email} = req.body
        try {
            const checkActive = await User.findOne({email:email})
            if(checkActive.active === true){
                return res.status(200).json({
                    message:'tài khoản này đã kích hoạt trước đó'
                })
            }
            const activate = await User.findOneAndUpdate({email:email, codeActive: code},{
                active: true,
                codeActive: null
            })
            if(activate){
                return res.status(200).json({
                    message:'kích hoạt tài khoản thành công'
                })
            }else{
                return res.status(400).json({
                    message:'kích hoạt tài khoản thất bại.'
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }


}
module.exports = new userController