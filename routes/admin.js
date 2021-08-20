const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");
const Request = require("../models/request");

//GET ALL FLAGGED POSTS
router.get("/", async (req, res) => {
  try {
    let posts;
    posts = await Post.find({ flags: { $size: { $gt: 0 } } });
    res.status(200).json(posts);
  } catch (err) {
    conosle.log(err);
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

  try {
    const posts = await Post.find({
      "flags.0": { $exists: 1 },
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
    conosle.log(err);
    res.status(500).json(err);
  }
});

//MODERATOR APPROVES POST
router.put("/approve/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $set: { flags: [] },
    });

    res.status(200).json("Post approved for Community.");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

const declineReq = async (id) => {
  const updatedReq = await Request.findByIdAndUpdate(
    id,
    {
      $set: { status: "down" },
    },
    { new: true }
  );
  const getData = async (requestid) => {
    const requestData = await Request.findById(requestid);
    const postData = await Post.findById(requestData.postid);
    const userData = await User.findById(postData.userid);
    const username = userData.username;
    const postTitle = await postData.title;
    return {
      title: postTitle,
      username: username,
      status: "down",
      requestid: requestid,
    };
  };
  const data = await getData(id);
  const reqId = updatedReq.userid;
  await User.findByIdAndUpdate(
    reqId,
    {
      $push: { notifications: data },
    },
    { new: true }
  );
  return data;
};

//MODERATOR DELETES POST
router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const p1 = async () =>
      Promise.all(post.requests.map((item) => declineReq(item)));
    const p2 = async () =>
      Promise.all(post.requests.map((item) => Request.findByIdAndDelete(item)));
    p1().then(() => p2().then());
    await Post.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(
      post.userid,
      {
        $inc: { noOfPosts: -1 },
      },
      { new: true }
    );
    res.status(200).json("Post taken down");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
