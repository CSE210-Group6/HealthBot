const { app } = require('@azure/functions');
const { sql } = require('mssql');

const sqlConnectionString = process.env["SQLConnectionString"];

const getUserInfoFromDB = async (accessToken) => {
    const pool = new sql.ConnectionPool(sqlConnectionString);
    await pool.connect();
    const result = await pool.request()
        .input('accessToken', sql.NVarChar, accessToken)
        .query('SELECT name, email, photo_base64 FROM Users WHERE access_token = @accessToken');
    if (result.recordset.length === 0) {
        return null;
    }
    return result.recordset[0];
};

app.http('userInfo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const accessToken = request.query.get('access_token');
        if (!accessToken) {
            return {
                status: 400,
                body: 'Missing Google Access Token and Email'
            };
        }

        const user = await getUserInfoFromDB(accessToken);
        if (!user) {
            const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${accessToken}` } });
            const user = await userResponse.json();
            const photoBase64 = await fetch(user.photo)
                .then(response => response.arrayBuffer()
                    .then(blob => {
                        const contentType = response.headers.get('content-type');
                        const base64String = `data:${contentType};base64,${Buffer.from(blob).toString('base64')}`;
                        return base64String;
                    }));

            // Store the user info in the database
            const pool = new sql.ConnectionPool(sqlConnectionString);
            await pool.connect();
            await pool.request()
                .input('accessToken', sql.NVarChar, accessToken)
                .input('email', sql.NVarChar, user.email)
                .input('name', sql.NVarChar, user.name)
                .input('photo_base64', sql.NVarChar, photoBase64)
                .query('INSERT INTO Users (access_token, email, name, photo_base64) VALUES (@accessToken, @email, @name, @photo_base64)');

            return {
                status: 200,
                body: {
                    access_token: accessToken,
                    name: user.name,
                    email: user.email,
                    photoBase64: photoBase64
                }
            };
        }

        return {
            status: 200,
            body: {
                access_token: accessToken,
                name: user.name,
                email: user.email,
                photoBase64: user.photo_base64
            }
        };
    }
});
