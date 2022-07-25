const mysql = require('mysql2/promise');
const config = require('../config');



class User {
    constructor(id, email, password)
    {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    async getUserByEmail(email)
    {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute(`SELECT * FROM users WHERE email="${email}" LIMIT 1`);
        connection.end();
        const user = rows[0];
        return user;
    }


    async addUser(email, name, password)
    {
        const connection = await mysql.createConnection(config);
        await connection.execute(`INSERT INTO users SET  email="${email}", name="${name}", password="${password}"`);
        connection.end();
    }

    async changePass(email ,newPass)
    {
        const connection = await mysql.createConnection(config);
        await  connection.execute(`
            UPDATE users SET 
            resetKey=NULL,
            resetKeyExp=NULL,
            password="${newPass}"
            WHERE email="${email} " LIMIT 1
        `); 
        connection.end();
    }

    // async checkPass(email, password)
    // {
    //     const connection = await mysql.createConnection(config);
    //     const [rows] = await connection.execute(`SELECT * FROM users WHERE email="${email}"`);
    //     const user = rows[0];
    //     return user;

    // }

    async checkAuth(email)
    {
        const connection =  await mysql.createConnection(config)
        const [rows] = await connection.execute(`SELECT *, LENGTH(session) as length FROM sessions WHERE LENGTH(session) > 200`);

        

        let authArr = [];
        rows.forEach(e => {
            const res = JSON.parse(e.session);
            if(res.user)
            {
                if(res.user.email == email)
                {

                    authArr.push(e)
                }
            }
            
        });

        for(let i = 0; i < authArr.length; i++)
        {
            await connection.execute(`DELETE FROM sessions WHERE sid="${authArr[i].sid}"`);
        }
        
        connection.end();

    }

    async checkPass(email, pass)
    {
        const user = await new User().getUserByEmail(email);

        if(user.password == pass)
        {
            return true
        }
        return false
        
        

        




    }



}


module.exports = User;