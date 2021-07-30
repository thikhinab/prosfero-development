// const TelegramBot = require('node-telegram-bot-api');

// const token = process.env.TOKEN;

// // Created instance of TelegramBot
// const bot = new TelegramBot(token, {
//     polling: true

// });// Listener (handler) for telegram's /loginevent
// bot.onText(/\/login/, (msg, match) => {
//     const chatId = msg.chat.id;
//     const username = match.input.split(' ')[1];
//     const password = match.input.split(' ')[2];
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message

//     if (username === undefined) {
//         bot.sendMessage(
//             chatId,
//             'Please provide username and password!',
//         );
//         return;
//     }

//     const url = 'api/v1/users/login'

//     axios.post(url, {
//         username: state.username,
//         password: state.password
//     }
//     ).then(
//         res => {
//             if (res.data.error === undefined) {
//                 localStorage.setItem("prosfero-token", res.data.token)
//                 localStorage.setItem("prosfero-id", res.data.id)
//                 setUser(
//                     {
//                         token: res.data.token,
//                         id: res.data.id,
//                         expired: false
//                     }
//                     )
//                 }
//             })
//     bot.sendMessage(
//         chatId,
//         'URL has been successfully saved!',
//     );
// });
