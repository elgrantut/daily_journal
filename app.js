//jshint esversion:6

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const { lowerCase } = require('lodash')

const app = express()

// environment variables

require('dotenv').config()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// Mongo DB connection

const uri = 'mongodb://localhost:27017/blogDB'

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connection to database successfull'))
mongoose.set('useFindAndModify', false)

// Create new Schema

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
})

//Create collection

const Post = mongoose.model('Post', blogSchema)

// initial Data

const homeStartingContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut blandit mi, at luctus lorem. Aenean vehicula aliquam maximus. Vestibulum cursus diam at velit dictum pellentesque et et mauris. Morbi ultricies fermentum urna ac dignissim. Nam consequat, neque a pharetra finibus, dui risus congue neque, vel pretium magna mi at mauris. Aenean pulvinar elementum dolor non suscipit. Etiam aliquet urna nec nisi ultricies, vel posuere nisi vehicula. Phasellus aliquet rhoncus ex.'
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.'
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.'

const posts = []

// Routes

app.get('/', (req, res) => {
  Post.find({}, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.render('home', {
        homeStartingContent: homeStartingContent,
        posts: result,
      })
    }
  })
})

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent })
})

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
})
app.get('/compose', (req, res) => {
  res.render('compose')
})

// Handlers

app.post('/compose', (req, res) => {
  // Create New Post
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  })
  post.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
})

app.get('/posts/:postId', (req, res) => {
  const reqPostId = req.params.postId

  Post.findOne({ _id: reqPostId }, (err, post) => {
    if (err) {
      console.log(err)
    } else {
      res.render('post', {
        title: post.title,
        content: post.content,
      })
    }
  })
})

//Listen to port
let port = process.env.PORT
if (port == null || port == '') {
  port = 3000
}

app.listen(port, () => console.log('Server started successfully'))
