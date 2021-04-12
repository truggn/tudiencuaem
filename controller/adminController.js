
const User = require('../model/user')
const Posts = require('../model/post')

class adminController {
    async lockAcount(req, res) {
        try {
            // check requset , admin mới lock acount
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Bạn không có quyền Khóa tài khoản.'
                })
            } else {
                let lockAcount = await User.findOneAndUpdate({ _id: req.params.id }, { isLockAcount: true }, { new: true })
                if (!lockAcount) {
                    return res.status(400).json({
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
                message: 'Hệ thống gặp lỗi.'
            })
        }
    };

    // @ MỞ TÀI KHOẢN 
    async openAcount(req, res, next) {
        try {
            // check requset , admin mới lock acount
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền này.'
                })
            } else {
                let lockAcount = await User.findOneAndUpdate({ _id: req.params.id }, { isLockAcount: false }, { new: true })
                if (!lockAcount) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mở tài khoản này không thành công.!!!'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'Mở khóa tài khoản này thành công.'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Hệ thống gặp lỗi.'
            })
        }
    };

    // @PATCH EXECUTED POST
    async executedPost(req, res) {
        try {
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền này.'
                })
            } else {
                let executed = await Posts.findOneAndUpdate({ _id: req.params.id }, { status: 'OK' }, { new: true })
                if (!executed) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể xác nhận.!!!'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'Bài đăng đã cho phép được hoạt động.'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Hệ thống gặp lỗi.'
            })
        }
    };
    // @ PATCH BLOCK STATUS POSTS -> [NOOP]
    async blockPosts(req, res) {
        try {
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền này.'
                })
            } else {
                let executed = await Posts.findOneAndUpdate({ _id: req.params.id }, { status: 'NOOP' }, { new: true })
                if (!executed) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể xác nhận.!!!'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'Bài đăng đã cấm hoạt động.'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Hệ thống gặp lỗi.'
            })
        }
    };
    async destroyPosts(req, res) {
        try {
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ admin mới có quyền này.'
                })
            } else {
                const destroy = await Posts.deleteOne({ _id: req.params.id })
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
                message: 'Hệ thống gặp lỗi.'
            })
        }
    }
}

module.exports = new adminController