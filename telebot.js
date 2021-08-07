const TeleBot = require("telebot");
const Telegrambot = require("./models/telebot");
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on(["/start", "/hello"], async (msg) => {
  let id = msg.from.id;
  const user = await Telegrambot.findOne(
    { teleusername: msg.from.username },
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  const user2 = await Telegrambot.findByIdAndUpdate(user._id, {
    $set: {
      chatid: id,
      confirmed: true,
    },
  });
  return bot.sendMessage(
    id,
    `Great! This account has now successfully been registered for the Prosfero bot, under the user account ${user.webusername}.`
  );
});

module.exports = bot;
