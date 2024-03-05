const { app } = require('@azure/functions');
const sql = require('mssql');

const sqlConnectionString = process.env["SQLConnectionString"];

const getUserInfoFromDB = async (username) => {
    const pool = await sql.connect(sqlConnectionString);
    const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT username, password FROM users WHERE username = @username');
    if (result.recordset.length === 0) {
        return null;
    }
    return result.recordset[0];
};

app.http('userInfo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const username = request.query.get('username');
        const password = request.query.get('password');
        context.res = {
            status: 200,
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8081',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

        const user = await getUserInfoFromDB(username);
        if (!user) {
            // Store the user info in the database
            const pool = await sql.connect(sqlConnectionString);
            await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, password)
                .query('INSERT INTO users (username, password) VALUES (@username, @password)');

            return context.res;
        }

        if (user.password !== password) {
            context.res.status = 401;
            context.res.body = JSON.stringify({
                "message": "Invalid password"
            });
            return context.res;
        }

        return context.res;
    }
});
