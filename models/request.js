const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    postid:{
        type: String,
        //required: true
    },
    userid: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: ""
    }
  },
  { 
    collections: 'requests',
    timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema)