const TeleBot = require('telebot');
//const User = require('./models/User');
const Telegrambot = require('./models/telebot');

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

//On every text message
// bot.on('text', msg => {
//     let id = msg.from.id;
//     let text = msg.text;
//     //console.log(msg)
//     return bot.sendMessage(id, `You said: ${ text }`);
// });

bot.on(['/start', '/hello'], async (msg) => {
    let id = msg.from.id
    const user = await Telegrambot.findOne( {"teleusername": msg.from.username}, 
    function(err) {
        if (err) {
            console.log(err)
        }
    });
    const user2 = await Telegrambot.findByIdAndUpdate(user._id, {
        $set: {
            chatid: id,
            confirmed: true
        }
    })
    return bot.sendMessage(id, `Great! This account has now successfully been registered for the Prosfero bot, under the user account ${user.webusername}.`)
});

//bot.start();

module.exports = bot