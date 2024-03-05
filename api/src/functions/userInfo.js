const { app } = require('@azure/functions');
const { sql } = require('mssql');

const sqlConnectionString = process.env["SQLConnectionString"];

const getUserInfoFromDB = async (username) => {
    const pool = new sql.ConnectionPool(sqlConnectionString);
    await pool.connect();
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

        const user = await getUserInfoFromDB(username);
        if (!user) {
            // Store the user info in the database
            const pool = new sql.ConnectionPool(sqlConnectionString);
            await pool.connect();
            await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, password)
                .query('INSERT INTO users (username, password) VALUES (@username, @password)');

            return {
                status: 200,
                body: {
                    username: username,
                }
            };
        }

        if (user.password !== password) {
            return {
                status: 401,
                body: {
                    message: 'Invalid password'
                }
            };
        }

        return {
            status: 200,
            body: {
                username: username,
            }
        };
    }
});
