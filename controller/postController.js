const Post = require('../model/posts')
const User = require('../model/users')
const TypePost = require('../model/typeposts')
const Comment = require('../model/comment')
const validator = require('validator')
const TEXT1 = process.env.TEXT1
const TEXT2 = process.env.TEXT2
class postController {

    // Get POST
    async homePosts(req, res) {
        try {
            const perPage = 5;
            const page = req.query.page || 1;
            const posts = await Post.find()
            .sort({createdAt:'desc'})
            .where({isDeleted:false})
            .populate({
                path:'userId',
                model:User,
                select:'username'
            })
            .populate({
                path:'typePostId',
                model:TypePost,
                select:'types'
            })
            .skip((perPage * page) - perPage)  // trong page dau tien bo qua gia tri 0
            .limit(perPage)
            return res.status(200).json({
                success: true,
                data: posts,
                message: "Load danh sách bài đăng thành công."

            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Create POST 
    async createPost(req, res) {
        const { title,
            description,
            typepostId
        } = req.body

        if (validator.isEmpty(title)) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền tiêu đề."
            })
        }
        if(title.length > 30) {
            return res.status(400).json({
                success: false,
                message: "tiêu đề giới hạn 30 ký tự."
            })
        }
        if (title.includes(TEXT1) || title.includes(TEXT2)) {
            return res.status(400).json({
                success: false,
                message: "Từ điển không hợp lệ."
            })
        }
        if (validator.isEmpty(description)) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền nội dung bài đăng."
            })
        }
        if (description.includes(TEXT1) || description.includes(TEXT2)) {
            return res.status(400).json({
                success: false,
                message: "Nội dung không hợp lệ."
            })
        }
        try {
            const typePost = await TypePost.findOne({ _id: typepostId })
            if (!typePost) {
                return res.status(401).json({
                    success: false,
                    message: "Chưa chọn loại bài đăng?"
                })
            }
            const newPost = new Post({
                title,
                description,
                typePostId: typePost._id,
                userId: req.userId
            })
            const data = await newPost.save()
            return res.status(200).json({
                success: true,
                data: data,
                message: "Thành công."
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    // PUT POSTS
    async updatePosts(req, res) {
        const { title, description, typepostId} = req.body
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền Tiêu đề Bài đăng."
            })
        }
        if (title.includes(TEXT1) || title.includes(TEXT2)) {
            return res.status(400).json({
                success: false,
                message: "tiêu đề không hợp lệ"
            })
        }
        if (validator.isEmpty(description)) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng thêm nội dung bài đăng."
            })
        }
        if (description.includes(TEXT1) ||description.includes(TEXT2)  ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng thêm nội dung bài đăng."
            })
        }
        try {
           const updatedPost = await Post.findOneAndUpdate({ _id: req.params.id, userId: req.userId },
                {title:title,
                description:description,
                typepostId:typepostId
            }, { new: true })
            //check user , user authorised to update 
            if (!updatedPost) {
                return res.status(401).json({
                    success: false,
                    message: "Posts not found with authorised.!!!"
                })
            }
            return res.status(200).json({
                success: true,
                data: updatedPost,
                message: "Cập nhật bài đăng thành công."
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    // DELETE POSTS
    async deletePosts(req, res) {
        try {
            let deletePost = await Post.findOneAndUpdate(
                { _id: req.params.id, userId: req.userId },
                { isDeleted: true, },
                { new: true }
            )
            //check user , user authorised to delete 
            if (!deletePost) {
                return res.status(401).json({
                    success: false,
                    message: "Posts not found with authorised"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Xóa bài đăng thành công."
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Hệ thống gặp lỗi.!!!"
            })
        }
    }
    // POST createPostSpecies
    async createTypePost(req, res) {
        const { types } = req.body
        if (!types) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền tên loại bài đăng."
            })
        }
        try {
            const checkRole = await User.findOne({ _id: req.userId })
            if (checkRole.roles !== 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Bạn không có quyền thêm loại.'
                })
            }
            else {
                const typePost = new TypePost({
                    types,
                    user: req.userId
                })

                const data = await typePost.save()
                return res.status(200).json({
                    success: true,
                    data: data,
                    message: "Thêm thành công."
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

    // GET type
    async getTypepost(req, res) {
       try {
           const data = await TypePost.find().select('-user')
           if(data){
               return res.status(200).json({
                   data: data,
                   message:'thành công'
               })
           }else{
               return res.status(400).json({
                   data: null,
                   message:'thất bại'
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

    // LOAD BÀI ĐĂNG THEO NGƯỜI ĐĂNG
    async loadPostsById(req, res, next) {
        try {
            const perPage = 10;
            const page = req.query.page || 1;
            const result = await Post.find({ userId: req.userId })
            .where({isDeleted:false})
            .sort({createdAt:'desc'})
            .populate({
                path:'typePostId',
                model:TypePost,
                select:'types'
            })
            .skip((perPage * page) - perPage)  // trong page dau tien bo qua gia tri 0
            .limit(perPage)
            if (!result) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: 'Bạn chưa có bài đăng nào.'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    data: result,
                    message: 'Tải bài đăng thành công.'
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
    // TẢI BÀI ĐĂNG THEO LOẠI
    async postsBySpecies(req, res) {
        try {
            const perPage = 10;
            const page = req.query.page || 1;
            const data = await Post.find({ typePostId: req.params.id })
            .where({isDeleted:false})
            .sort({createdAt:'desc'})
            .populate({
                path:'userId',
                model:User,
                select:'username'
            })
            .populate({
                path:'typePostId',
                model:TypePost,
                select:'types'
            })
            .skip((perPage * page) - perPage)  // trong page dau tien bo qua gia tri 0
            .limit(perPage)
            if (data) {
                return res.status(200).json({
                    success: true,
                    data: data,
                    message: 'Tải bài đăng thành công'
                })
            } else {
                return res.status(401).json({
                    success: false,
                    data: null,
                    message: 'Tải bài đăng thất bại'
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                data: null,
                message: error.message
            })
        }
    };
    //LIKE POST
    async likepost(req, res){
        try {
        let data = await Post.findOne({_id: req.params.id})
           await Post.updateMany({_id: req.params.id},{
              $set: {like: data.like + 1}
            },{new: true})
            return res.status(200).json({
                message:'like success'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: error.message
            })
        }
    };

    // DISKLIKE POST
    async disklikepost(req, res){
        try {
        let data = await Post.findOne({_id: req.params.id})
           await Post.updateMany({_id: req.params.id},{
              $set: {disklike: data.disklike + 1}
            },{new: true})
            return res.status(200).json({
                message:'disklike success'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: error.message
            })
        }
    };
    //COMMENT POST
    async commentpost(req, res){
        const {content} = req.body
        if(content.length === 0) return res.status(400).json({
            success: false,
            message: 'không dùng từ ngữ bậy bạ'
        })
        if(content.includes(TEXT1) ||content.includes(TEXT2) ) return res.status(400).json({
            success: false,
            message: 'không dùng từ ngữ bậy bạ'
        })
        try {
            const comment = new Comment({
                content: content,
                userId: req.userId,
                postId: req.params.id
            })
            const savedata = await comment.save()
            const data = await Comment.findOne({_id: savedata.id}).select('-postId').populate({
                path:'userId',
                model:User,
                select:'username'
            })
            return res.status(200).json({
                data: data,
                success: true,
                message:'ok'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: error.message
            })
        }
    };
    // READ COMMENT POST
    async readcomment(req, res){
        try {
            const perPage = 6;
            const page = req.query.page || 1;
            const data = await Comment.find({postId: req.params.id})
            .select('-postId')
            .sort({createdAt:'desc'})
            .skip((perPage * page) - perPage)  // trong page dau tien bo qua gia tri 0
            .limit(perPage)
            .populate({
                path:'userId',
                model:User,
                select:'username'
            })
            return res.status(200).json({
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: error.message
            })
        }
    }
}
module.exports = new postController