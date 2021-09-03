const express = require('express')
const postController = require('../controller/postController')
const route = express.Router()
const auth = require('../middleware/auth')


route.get('/', postController.homePosts)
route.get('/by-type/:id', postController.postsBySpecies)
// @POSTS 
route.post('/create', auth, postController.createPost)
route.put('/update/:id', auth, postController.updatePosts)
route.put('/delete/:id', auth, postController.deletePosts)

// @LOAI BAI DANG
route.post('/create-type', auth, postController.createTypePost)
route.get('/type', postController.getTypepost)

// @POST BY USER
route.get('/by-user/:id', auth, postController.loadPostsById)


module.exports = route