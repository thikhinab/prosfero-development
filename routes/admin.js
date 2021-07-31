const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");

//GET ALL FLAGGED POSTS
router.get("/", async (req, res) => {
    try {
      let posts;
      posts = await Post.find({ flags : { $size: { $gt : 0 } }})
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;