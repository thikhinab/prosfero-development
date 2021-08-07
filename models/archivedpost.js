const mongoose = require("mongoose");

const ArchivedPostSchema = new mongoose.Schema(
  {
    oldId: {
      type: String,
      required: true,
      unique: true,
    },
    originalDate: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
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
    collections: "archivedPosts",
    timestamps: true,
  }
);

module.exports = mongoose.model("archivedPost", ArchivedPostSchema);
