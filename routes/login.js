const {Router} = require('express');
const {validationResult} = require('express-validator');
const router = Router();
const mysql = require('mysql2/promise');
const {loginValidators, resetValidators, confirmValidators} = require('../utils/validators');
const config = require('../config');
const url = require('url');
const User = require('../models/user');
const randomNumbers = require('random-numbers');

const nodemailer = require('nodemailer'); 
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    auth: {
      user: 'online_test@zerdegroup.kz',
      pass: ''
    }
});


const resetEmail = require('../emails/reset');
const changeEmail = require('../emails/changePass');
const userM = new User();

router.get('/', (req, res) => {
    
    if(req.user)
    {
        return res.redirect('/tests');
    }
    res.render('login', {
        isLogin: true,
        title: 'Авторизация',
        loginError: req.flash('loginError'),
        registerSuccess: req.flash('registerSuccess'),
        confirmSuccess: req.flash('confirmSuccess')
    })
});




router.post('/', loginValidators, async (req, res) => {
    try {
        
        const {email, password} = req.body;
        const errors = validationResult(req);
        
        if(!errors.isEmpty())
        {
            req.flash('loginError', errors.array()[0].msg);
            return res.status(422).redirect('/login')
        }
        const user = await userM.getUserByEmail(email);

        if(user)
        {
            if(user.password == password)
            {   
                await userM.checkAuth(user.email);
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/');
                });
            }

        
            else 
            {
                res.redirect('/login');
            }
        } else 
        {
            res.redirect('/login');
        }

        
    }
    catch(e)
    {
        console.log(e);
    }
});



router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');

    })
});

router.get('/confirm', async(req, res) => {
    if(req.user)
    {
        return res.redirect('/');
    }
    let urlReq = url.parse(req.url, true);
    const email = (urlReq.query.email);
    if(email)
    {
        const user = await userM.getUserByEmail(email);
        if (user)
        {
            
        } else 
        {
            return res.redirect('/login/reset') 
        }
    } else 
    {
        return res.redirect('/login/reset') 
    }

    

    res.render('confirm', {
        title: 'Аутентификация аккаунта - ' + email,
        email,
        addMenu: '../js/menu.js',
        confirmError: req.flash('confirmError'),
        error: req.flash('error')
    })
});

router.post('/confirm', confirmValidators, async(req, res) => {

    const errors =  validationResult(req);
    const {password, email, secretKey} = req.body;
    const user = await userM.getUserByEmail(email);
    if(!errors.isEmpty())
    {
        req.flash('confirmError', errors.array()[0].msg);
        return res.status(422).redirect(`/login/confirm?email=${email}`);
    }

    if(user.email == email && user.resetKey == secretKey)
    {
        const userDate = {
            day: user.resetKeyExp.getDate(),
            month: user.resetKeyExp.getMonth(),
            year: user.resetKeyExp.getFullYear(),
            hour: user.resetKeyExp.getHours(),
            minutes: user.resetKeyExp.getMinutes(),
        }
        const now = new Date();
        const checkDate = {
            day: now.getDate(),
            month: now.getMonth(),
            year: now.getFullYear(),
            hour: now.getHours(),
            minutes: now.getMinutes(),
        }
        

        if( userDate.month == checkDate.month && 
            userDate.year == checkDate.year &&
            (userDate.day  == checkDate.day ||
            userDate.day ==  checkDate.day+1) &&
            userDate.hour >  checkDate.hour &&
            (userDate.minutes <=  checkDate.minutes)
            
            )
        {   
            await userM.changePass(email, password);
            await transporter.sendMail(changeEmail(email));
            req.flash('confirmSuccess', 'Вы успешно восстановили пароль, войдите')
            res.redirect('/login')
        } else
        {
            req.flash('error', 'Действие секретного кода истекло');
            return res.redirect(`/login/confirm?email=${email}`);  
        }
    } else 
    {   req.flash('error', 'Неверный код');
       

        return res.redirect(`/login/confirm?email=${email}`);
    }
    

    



})


router.get('/reset',  (req, res) => {
    if(req.user)
    {
        return res.redirect('/');
    }

    res.render('reset', {
        title: 'Восстановление пароля',
        resetError: req.flash('resetError'),
        addMenu: '../js/menu.js'
    })
});

router.post('/reset', resetValidators, async(req, res) => {
    const errors = validationResult(req);
        
    if(!errors.isEmpty())
    {
        req.flash('resetError', errors.array()[0].msg);
        return res.status(422).redirect('/login/reset');
    }

    const candidate = await userM.getUserByEmail(req.body.email);
    if (candidate)
    {   
        let key = '';
        for(let i = 0; i < 6; i++)
        {
            key += (randomNumbers.create(0, 10));
        }
        
        const connection = await mysql.createConnection(config);
        await  connection.execute(`
            UPDATE users SET 
            resetKey="${+key}",
            resetKeyExp=ADDDATE (NOW(), INTERVAL 1 HOUR)
            WHERE email="${candidate.email} " LIMIT 1
        `); 
        connection.end();
        await transporter.sendMail(resetEmail(candidate.email, +key));
        res.redirect(`/login/confirm?email=${req.body.email}`)
    } else {
        return res.redirect('/login/reset')
    }
    
});

module.exports = router;
