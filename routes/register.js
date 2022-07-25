const {Router} = require('express');
const router = Router();
const {validationResult} = require('express-validator');
const {registerValidators} = require('../utils/validators');
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
const mailReg = require('../emails/registration');

const user = new User();

router.get('/', (req, res) => {
    if(req.user)
    {
        return res.redirect('/');
    }
    return res.redirect('/'); //******************************************************* */
    res.render('register', {
        title: 'Регистрация',
        isRegister: true,
        registerError: req.flash('registerError')
    })
});

router.post('/', registerValidators, async(req, res) => {
    try
    {
        const errors = validationResult(req); 
        const {email, name, password} = req.body;

        if(!errors.isEmpty())
        {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/register')
        }

        await user.addUser(email, name, password);
        req.flash('registerSuccess', 'Ваш аккаунт успешно создан, войдите');
        await transporter.sendMail(mailReg(email));
        return res.redirect('/login');
    }
    catch(e)
    {
        console.log(e)
    }
});

module.exports = router;