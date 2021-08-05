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
    const { userid, title, desc, _id, createdAt, category, image, location, originalDate } =
      post._doc;
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
      originalDate
    };
    return newPost;
  };

  try {
    const posts = await archivedPost.find({
      userid: req.user.id
    }).limit(limit).skip(skip).sort(order);

    Promise.all(
      posts.map((post) => {
        return getPost(post);
      })
    ).then((data) => res.status(200).json(data));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router