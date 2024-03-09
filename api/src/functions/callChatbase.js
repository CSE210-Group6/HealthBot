const { app } = require('@azure/functions');

// const privateKey = process.env["PRIVATE_KEY"];
const chatbaseApiId1 = process.env["CHATBASE_API_ID_1"];
const chatbaseApiId2 = process.env["CHATBASE_API_ID_2"];
const chatbaseApiKey1 = process.env["CHATBASE_API_KEY_1"];

// const decryptMessage = (context, encryptedBody) => {
//     const keyBuffer = Buffer.from(encryptedBody.encryptedKey, 'hex');
//     const encryptedMessage = CryptoES.enc.Hex.parse(encryptedBody.encryptedMessage);
//     const iv = CryptoES.enc.Hex.parse(encryptedBody.iv);

//     const decryptedKey = CryptoES.enc.Hex.parse(privateDecrypt(privateKey, keyBuffer).toString('hex'));
//     const decryptedMessage = JSON.parse(CryptoES.AES.decrypt({ ciphertext: encryptedMessage }, decryptedKey, { iv: iv }).toString(CryptoES.enc.Utf8));

//     // context.log(decryptedMessage);
//     if (decryptedMessage.identity !== 'healthbot1') {
//         throw Error('Invalid identity');
//     }
//     return decryptedMessage;
// };

const callChatbase = async (context, decryptedMessage) => {
    context.log(decryptedMessage.selectedModel)
    var chat_bot_id = chatbaseApiId1;
    if (decryptedMessage.selectedModel == 'GH'){
        chat_bot_id = chatbaseApiId2;
    }
    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + chatbaseApiKey1
        },
        body: JSON.stringify({
            messages: decryptedMessage.messages,
            chatbotId: chat_bot_id,
            conversationId: decryptedMessage.conversationId
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        // context.log("errorData", errorData);
        return errorData.message;
    }
    const responseData = await response.json();
    // context.log(responseData);
    return responseData.text;
};

app.http('callChatbase', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async function (req, context) {
        context.log("Received request");
        const body = await req.json();
        // context.log(encryptedBody);
        context.res = {
            status: 200,
            body: await callChatbase(context, body),
        };
        return context.res;
    }
});