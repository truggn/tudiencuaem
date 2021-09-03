require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
// const db = require('../server/config/db/db')


const authRoute = require('../server/route/auth')
const postRoute = require('../server/route/post')
const adminRoute = require('../server/route/admin')
const userRoute = require('../server/route/user')
const cors = require('cors')

// db.connect()
try {
    const mongoose = require('mongoose')    
    console.log("Connected Successfully to Database.");
} catch (error) {
    console.log(`Connect to db False  with Error ${error}`);
}


const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)


const PORT = process.env.PORT || 4040

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`)
})