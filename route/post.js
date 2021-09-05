const express = require('express')
const postController = require('../controller/postController')
const route = express.Router()
const auth = require('../middleware/auth')


route.get('/', postController.homePosts)
route.get('/by-type/:id', postController.postsBySpecies)
// @BAI DANG 
route.post('/create', auth, postController.createPost)
route.put('/update/:id', auth, postController.updatePosts)
route.put('/delete/:id', auth, postController.deletePosts)
//@ COMMENT LIKE AND DISLIKE
route.put('/like/:id',auth,postController.likepost)
route.put('/disklike/:id',auth,postController.disklikepost)
route.post('/comment/:id',auth,postController.commentpost)
route.get('/comment/:id',postController.readcomment)

// @LOAI BAI DANG
route.post('/create-type', auth, postController.createTypePost)
route.get('/type', postController.getTypepost)

// @POST BY USER
route.get('/by-user/:id', auth, postController.loadPostsById)

//LIKE AND DISLIKE BAI DANG



module.exports = route