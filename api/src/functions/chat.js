const { app } = require('@azure/functions');
const sql = require('mssql');

const sqlConnectionString = process.env["SQLConnectionString"];

const getUserChatsFromDB = async (chat_id, username, role) => {
    // Ignore null params and filter according to the remaining params
    const pool = await sql.connect(sqlConnectionString);
    var request = pool.request()
        .input('chat_id', sql.Int, chat_id)
        .input('username', sql.NVarChar, username)
        .input('role', sql.NVarChar, role);
    if (chat_id && role) {
        request = request.query('SELECT * FROM chat WHERE username = @username AND chat_id = @chat_id AND role = @role');
    } else if (chat_id) {
        request = request.query('SELECT * FROM chat WHERE username = @username AND chat_id = @chat_id');
    } else if (role) {
        request = request.query('SELECT * FROM chat WHERE username = @username AND role = @role');
    } else {
        request = request.query('SELECT * FROM chat WHERE username = @username');
    }
    const result = await request;
    return result.recordset;
};

const putChatInDB = async (chat_id, username, role, chat_text) => {
    const pool = await sql.connect(sqlConnectionString);
    await pool.request()
        .input('chat_id', sql.Int, chat_id)
        .input('username', sql.NVarChar, username)
        .input('role', sql.NVarChar, role)
        .input('chat_text', sql.NVarChar, chat_text)
        .query('INSERT INTO chat (chat_id, username, role, chat_text) VALUES (@chat_id, @username, @role, @chat_text)');
}

app.http('chat', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const chat_id = request.query.get('chat_id');
        const username = request.query.get('username');
        const hashed_password = request.query.get('password');
        const role = request.query.get('role');

        context.res = {
            status: 200,
            body: "",
        }

        if (!username || !hashed_password) {
            context.res.status = 400;
            context.res.body = "Username and hashed password is required";
            return context.res;
        }

        const user = await getUserInfoFromDB(username);
        if (!user) {
            context.res.status = 401;
            context.res.body = "Invalid username or password";
            return context.res;
        }

        if (request.method === 'GET') {
            const chatHistory = await getUserChatsFromDB(chat_id, username, role);
            context.res.body = JSON.stringify(chatHistory);
            return context.res;
        }

        if (request.method === 'POST') {
            const body = await request.json();
            await putChatInDB(body.chat_id, body.username, body.role, body.chat_text);
            return context.res;
        }
    }
});
