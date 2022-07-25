module.exports = function(email, secretKey)
{
    return {
        from: 'online_test@zerdegroup.kz',
        to: email,
        subject: 'Запрос на смену пароля',
        html: `
            <h1>Мы получили ваш запрос на смену пароля к профилю Online Tests</h1>
            <p>Чтобы поменять пароль пожалуйста введите код ниже </p>
            <p style="font-size: 55px; text-align: center; color: #4b85e3">${secretKey}</p>
            <p>Данный код действует в течении часа</p>
            
            <hr/>
            <a href="http://localhost:3001">Онлайн тесты</a>
        `
    
    }
}
