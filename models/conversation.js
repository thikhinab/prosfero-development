const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    collections: "Conversation",
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
