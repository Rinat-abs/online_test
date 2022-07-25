module.exports = function(email)
{
    return {
        from: 'online_test@zerdegroup.kz',
        to: email,
        subject: 'Аккаунт создан',
        html: `
            <h1>Добро пожаловать на наш сайт</h1>
                <p>Вы успешно создали ваш аккаунт с E-mail - <b>${email}</b> </p>
                <hr/>
            <a href="http://localhost:3001">Онлайн тесты</a>
        ` 
    }
}