const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const { use } = require('passport/lib');

//Load config
dotenv.config({ path: './config/config.env' })

//Passport Config
require('./config/passport')(passport);

//Connect to database
connectDB();

const app = express()

//logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars helpers
const { formateDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

//Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        formateDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: "main",
    extname: '.hbs'
}
));
app.set('view engine', '.hbs');

//session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        })
    }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

//Port
const PORT = process.env.PORT || 3000;

//Listen
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} made on port ${PORT}`)
);
