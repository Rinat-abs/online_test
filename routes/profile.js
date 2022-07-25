const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const path = require('path');






router.get('/', auth, async(req, res) => {
    // console.log(path.join('C:/Users/TBrat/Desktop/папки/nodejs/online_test', './public'));
    res.render('profile', {
        name: req.user.name,
        email: req.user.email,
        isProfile: true,
        title: 'Ваш профиль',
        successChangePass: req.flash('successChangePass')

    })
});

const {validationResult} = require('express-validator');
const {changePassValidators} = require('../utils/validators');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    auth: {
      user: 'online_test@zerdegroup.kz',
      pass: ''
    }
});

const changePass = require('../emails/changePass');
const user = new User();

router.get('/change_pass', auth, async(req, res) => {

    res.render('change_pass', {
        title: 'Смена пароля',
        changePassError: req.flash('changePassError'),
        addMenu: '../js/menu.js'
        
    })
});

router.post('/change_pass', auth, changePassValidators, async(req, res) => {
    try 
    {
        const errors = validationResult(req); 
        const {new_pass} = req.body;

        if(!errors.isEmpty())
        {
            req.flash('changePassError', errors.array()[0].msg);
            return res.status(422).redirect('/profile/change_pass');
        }
        await user.changePass(req.user.email, new_pass);
        await transporter.sendMail(changePass(req.user.email));
        return res.redirect('/profile');
        




    }
    catch(e)
    {
        console.log(e);
    }

    res.render('change_pass', {
        title: 'Смена пароля',
        addMenu: '../js/menu.js'
        
    })
});



module.exports = router;