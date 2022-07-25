const express = require('express');
const path = require('path');
const fs = require('fs');

const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const config = require('./config')
const MySQLStore = require('connect-mysql')(session);
const options = {
    config,
    cleanup: true,
    keepalive: 500000000,
    table: 'sessions'
};

const userMiddleware = require('./middleware/user');
const varMiddleware = require('./middleware/variables');
const testRoutes = require('./routes/tests');
const homeRoutes = require('./routes/home');
const fileMiddleware = require('./middleware/file');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const progressRoutes = require('./routes/progress');
const profileRoutes = require('./routes/profile');
const feedbackRoutes = require('./routes/feedback');


let app = express();
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', 'views');


// app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, '/public')));
// console.log(path.join(__dirname, './public'));
app.use(express.urlencoded({extended: true}));


app.use(session({
    secret: '12312354gdfghth!!!кререждрнге????3453-6554аролшур',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        expires: 1000 * 60 * 60 * 24 * 3
      },
    store: new MySQLStore(options) 
}));

app.use(fileMiddleware.single('test'));
app.use(csrf());
app.use(flash());

app.use(varMiddleware);
app.use(userMiddleware);


app.use('/', homeRoutes);
app.use('/tests', testRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes)
app.use('/profile', profileRoutes);
app.use('/progress', progressRoutes);
app.use('/feedback', feedbackRoutes);



// const url = require('url');

app.get('/*', function(req, res){
    // let urlParts = url.parse(req.url);
    // console.log(urlParts);
    res.render('404', {
        title: 'Страница не найдена',
        addMenu: '../../js/menu.js'
    });
}); 

async function start()
{
    try
    {
        const PORT = process.env.PORT || 3355;
        app.listen(PORT, () => {
            console.log(`Server is running - ${PORT}`);
        });
    }
    catch(e)
    {
        console.log(e);
    }
}

start();




