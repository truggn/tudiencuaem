const User = require('../model/users')
const Posts = require('../model/posts')

class adminController {

    //[PUT] - LOCK ACCOUNT 
    async lockAcount(req, res) {
        const idAccount = req.params.id
        try {
            // check requset , admin mới lock acount
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(401).json({
                    success: false,
                    message: 'Bạn không có quyền Khóa tài khoản.'
                })
            } else {
                let lockAcount = await User.findOneAndUpdate({ _id: idAccount }, { isLockAcount: true }, { new: true })
                if (!lockAcount) {
                    return res.status(401).json({
                        success: false,
                        message: 'Khóa tài khoản này không thành công.!!!'
                    })
                }                
                return res.status(200).json({
                    success: true,
                    message: 'Khóa tài khoản này thành công.'
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

    // @ MỞ TÀI KHOẢN 
    async openAcount(req, res, next) {
        const idAccount = req.params.id
        try {
            // check requset , admin mới lock acount
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền này.'
                })
            } else {
                let lockAcount = await User.findOneAndUpdate({ _id: idAccount }, { isLockAcount: false }, { new: true })
                if (!lockAcount) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mở tài khoản này không thành công.!!!'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'Mở khóa tài khoản thành công.'
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
    //[DELETE] bài đăng
    async destroyPosts(req, res) {
        const idAccount = req.params.id
        try {
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền này.'
                })
            } else {
                const destroy = await Posts.deleteOne({ _id: idAccount })
                if (destroy) {
                    return res.status(200).json({
                        success: true,
                        message: 'Xác nhận đã xóa thành công.'
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Xóa không thành công.'
                    })
                }
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new adminController