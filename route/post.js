const express = require('express')
const postController = require('../controller/postController')
const route = express.Router()
const auth = require('../middleware/auth')

// @POSTS 
route.post('/create', auth, postController.createPost)
route.get('/', auth, postController.getPosts)
route.put('/:id', auth, postController.putPosts)
route.delete('/:id', auth, postController.destroyPosts)

// @SPECIES
route.post('/postspecies', auth, postController.createPostSpecies)
route.get('/postspecies', postController.getpostspecies)

// @POST BY USER
route.get('/posts-by-user/:id', auth, postController.loadPostsById)

module.exports = route