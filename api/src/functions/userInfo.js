const { app } = require('@azure/functions');
const sql = require('mssql');

const sqlConnectionString = process.env["SQLConnectionString"];

const getUserInfoFromDB = async (username) => {
    const pool = await sql.connect(sqlConnectionString);
    const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT username, password, photo_base64 FROM users WHERE username = @username');
    if (result.recordset.length === 0) {
        return null;
    }
    return result.recordset[0];
};

app.http('userInfo', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        var username;
        var password;
        var photo_base64;
        if (request.method === 'GET') {
            username = request.query.get('username');
            password = request.query.get('password');
        } else if (request.method == 'POST') {
            const body = await request.json();
            username = body.username;
            password = body.password;
            photo_base64 = body.photo_base64;
        }
        context.res = {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8081',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

        const user = await getUserInfoFromDB(username);
        if (!user) {
            if (request.method === 'GET') {
                context.res.status = 404;
                context.res.body = JSON.stringify({
                    "message": "User not found"
                });
                return context.res;
            }
            // Store the user info in the database
            const pool = await sql.connect(sqlConnectionString);
            await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, password)
                .input('photo_base64', sql.NVarChar, photo_base64)
                .query('INSERT INTO users (username, password, photo_base64) VALUES (@username, @password, @photo_base64)');

            context.res.status = 200;
            context.res.body = JSON.stringify({
                "username": username,
                "password": password,
                "photo_base64": photo_base64
            });
            return context.res;
        }

        if (user.password !== password) {
            context.res.status = 401;
            context.res.body = JSON.stringify({
                "message": "Invalid password"
            });
            return context.res;
        }

        context.res.status = 200;
        context.res.body = JSON.stringify({
            "username": user.username,
            "password": user.password,
            "photo_base64": user.photo_base64
        });
        return context.res;
    }
});
