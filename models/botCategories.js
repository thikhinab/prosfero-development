const mongoose = require("mongoose");

const botCategories = new mongoose.Schema(
  {
    category:{
        type: String,
    },
    users: {
      type: Array,
    },
  },
  { 
    collections: 'botCategories',
    timestamps: true }
);

module.exports = mongoose.model("botCategories", botCategories)