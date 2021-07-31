const router = require("express").Router();
const User = require("../models/user");
const archivedPost = require("../models/archivedpost");

//GET ALL OLD POSTS
router.get("/", async (req, res) => {
    try {
      let posts;
      posts = await archivedPost.find()
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router