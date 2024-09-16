let express = require('express')
let path = require('path')
let flash = require('express-flash')
let session = require('express-session')
let createError = require('http-errors')

let usersRouter = require('./routes/users')
let app = express()
let port = 3000;

// Template engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    cookie: { maxAge: 18000000 }, // 5 hours
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'gad-secret',
}))
app.use(flash())

// Routing
app.use('/users', usersRouter)

// Catching 404 & 4rward 2 error handler
app.use( function(req, res, next) {
    next(createError(404))
})

// Listen to this port
app.listen(port)