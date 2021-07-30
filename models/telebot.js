const mongoose = require("mongoose");

const TeleBot = new mongoose.Schema(
  {
    webusername:{
        type: String,
    },
    teleusername: {
      type: String,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    chatid: {
        type: String
    }
  },
  { 
    collections: 'telebot',
    timestamps: true }
);

module.exports = mongoose.model("Telebot", TeleBot)