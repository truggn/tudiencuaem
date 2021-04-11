require('dotenv').config()
const express = require('express')
const db = require('../server/config/db/db')
const authRoute = require('../server/route/auth')
const postRoute = require('../server/route/post')
const cors = require('cors')

db.connect()

const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)


const PORT = 4040

app.listen(PORT, () => {
    console.log(`server started on Port ${PORT}`)
})