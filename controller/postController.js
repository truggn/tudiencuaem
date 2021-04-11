const Post = require('../model/post')
const User = require('../model/user')
const PostSpecies = require('../model/postspecies')
const multipleUploadMiddleware = require("../middleware/uploadFile");

class postController {

    // Get POST
    async getPosts(req, res) {
        try {
            const posts = await Post.findOne({ user: req.userId }).populate('users', ['username'])
            return res.status(200).json({
                success: true,
                data: posts,
                message: "Load danh sách bài đăng thành công."

            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'internal server Error'
            })
        }
    }

    // Create POST 
    async createPost(req, res) {

        const { title,
            description,
            url,
            status,
            speciesId,
            image,

        } = req.body

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền Tiêu đề bài đăng."
            })
        }
        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền nội dung bài đăng."
            })
        }
        try {
            const newPost = new Post({
                title,
                description,
                url: (url.startsWith('https://')) ? url : `https://${url}`,
                status: status || 'NOOP', // trạng thái chờ xác nhận [NOOP] , // Trạng thái đã xác nhận [OK]
                userId: req.userId,
                image
            })
            const data = await newPost.save()

            const species = await PostSpecies.findOne({ _id: speciesId })
            if (!species) {
                return res.status(401).json({
                    success: false,
                    message: "Chưa chọn loại bài đăng?"
                })
            }
            data.speciesId.push(speciesId)
            await data.save()
            return res.status(200).json({
                success: true,
                data: data,
                message: "Thành công. Hãy chờ xác nhận."
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Hệ thống gặp lỗi!!!"
            })
        }
    }
    // PUT POSTS
    async putPosts(req, res) {
        const { titel, description, url } = req.body
        if (!titel) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền Tiêu đề Bài đăng."
            })
        }
        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng thêm nội dung bài đăng."
            })
        }
        try {
            let updatedPost = {
                titel,
                description: description || '',
                url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            }
            updatedPost = await Post.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updatedPost, { new: true })

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
                message: "Hệ thống gặp lỗi.!!!"
            })
        }
    }
    // DELETE POSTS
    async destroyPosts(req, res) {
        try {

            let deletePost = await Post.findOneAndDelete({ _id: req.params.id, user: req.userId })

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
    async createPostSpecies(req, res) {
        const { species, description } = req.body
        if (!species) {
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
            } else {
                const postSpecies = new PostSpecies({
                    species,
                    description,
                    user: req.userId
                })

                const data = await postSpecies.save()
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
                message: "Hệ thống gặp lỗi.!!!"
            })
        }

    };
    async getpostspecies(req, res) {
        const { speciesId } = req.body
        const data = await PostSpecies.findOne({})
    };
    // LOAD BÀI ĐĂNG THEO UserId
    async loadPostsById(req, res, next) {
        try {
            const result = await Post.find({ userId: req.userId })
            console.log(req.userId)
            console.log(result)
            if (!result) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: 'Bạn chưa có bài đăng nào.'
                })
            }
            return res.status(200).json({
                success: true,
                data: result,
                message: 'Tải bài đăng thành công.'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tải bài đăng.'
            })
        }
    }

}
module.exports = new postController