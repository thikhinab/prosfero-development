const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    requests: {
      type: Array,
      required: false,
    },
    location: {
      label: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
  },
  {
    collections: "posts",
    timestamps: true,
  }
);

PostSchema.index({ title: "text", desc: "text", category: "text" });

module.exports = mongoose.model("Post", PostSchema);
