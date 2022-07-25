const {body} = require('express-validator');
const User = require('../models/user');

exports.loginValidators = [
    body('email', 'Введите корректный email').isEmail(),
    body('password').custom( async(value, {req}) => {
        const user = await new User().getUserByEmail(req.body.email);
        if(user)
        {
            if( value !== user.password)
            {
                throw new Error('Неверный E-mail или пароль');
            }
            return true
        }
        else
        {
            throw new Error('Неверный E-mail или пароль');
        }
    })
]

exports.registerValidators = [
    body('email', 'Введите корректный E-mail')
    .isEmail()
    .normalizeEmail()
    .trim(),
    body('email').custom( async(value, {req})=> {
        try
        {
            const user = await new User().getUserByEmail(value);
            if(user)
            {
                return Promise.reject('Данный E-mail уже занят');
            }
           
           
        }
        catch(e)
        {
            console.log(e)
        }
    }),
    body('name', 'Имя должно быть минимум 2 символа').isLength({min: 2, max: 20}).trim(),
    body('name', 'Имя должно быть записано только киррилицей').isAlpha('ru-RU'),
    body('password', 'Пароль должен быть минимум  6 символов')
    .isLength({min: 6, max: 56})
    

    
]

exports.resetValidators = [
    body('email', 'Введите корректный E-mail')
    .isEmail()
    .normalizeEmail()
    .trim(),
    body('email').custom( async(value, {req})=> {
        try
        {
            const user = await new User().getUserByEmail(value);
            if(!user)
            {
                return Promise.reject('Данного E-mail адреса нет в нашей базе');
            }
           
           
        }
        catch(e)
        {
            console.log(e)
        }
    })
]

exports.confirmValidators = [
    body('secretKey', 'Неверный код')
    .isLength(6)
    .isInt(),
    body('password', 'Пароль должен быть минимум  6 символов')
    .isLength({min: 6, max: 56})
]


exports.changePassValidators = [
    body('pass').custom( async(value , {req})=> {

        const user = await new User().checkPass(req.user.email, req.body.pass);
        console.log(user);
        if(!user)
        {
            return Promise.reject('Неверный пароль');
        }


    }),
    body('new_pass', 'Пароль должен быть минимум  6 символов')
    .isLength({min: 6, max: 56})

]