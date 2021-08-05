const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");

//GET ALL FLAGGED POSTS
router.get("/", async (req, res) => {
  try {
    let posts;
    posts = await Post.find({ flags: { $size: { $gt: 0 } } });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET LIMITED NUMBER OF POSTS
router.get("/limited/:limit/:skip", async (req, res) => {
  const skip = parseInt(req.params.skip) || 0;
  const limit = parseInt(req.params.limit) || 0;
  const descending = parseInt(req.query.order);
  let order = "-createdAt";
  if (descending !== 1) {
    order = "createdAt";
  }

  const getPost = async (post) => {
    const {
      userid,
      title,
      desc,
      _id,
      createdAt,
      category,
      image,
      location,
      flags,
    } = post._doc;
    const user = await User.findById(userid);
    const { username, ...rest } = user._doc;
    const newPost = {
      id: _id,
      title,
      desc,
      createdAt,
      image,
      category,
      username,
      location,
      flags: flags.length,
    };
    return newPost;
  };
  /* { flags: { $size: { $gt: 0 } } } */
  try {
    const posts = await Post.find({
      $where: `this.flags.length>=${process.env.FLAG_LIMIT}`,
    })
      .limit(limit)
      .skip(skip)
      .sort(order);

    Promise.all(
      posts.map((post) => {
        return getPost(post);
      })
    ).then((data) => res.status(200).json(data));
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $set: { flags: [] },
    });

    res.status(200).json("Post approved for Community.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.status(200).json("Post deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
