const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");
const Request = require("../models/request");
const archivedPost = require("../models/archivedpost");
const { request } = require("express");

//GET INCOMING REQUESTS DATA FOR A USER
router.get("/", async (req, res) => {
  const userid = req.user.id;

  try {
    const posts = await Post.find({ userid: userid });
    const requests = [];
    posts.forEach(function (post) {
      requests.push(...post.requests);
    });

    const getData = async (requestid) => {
      const requestData = await Request.findById(requestid);
      const userData = await User.findById(requestData.userid);
      const contact = userData.email;
      const username = userData.username;
      const status = requestData.status;
      const postData = await Post.findById(requestData.postid);
      const postTitle = await postData.title;
      return [
        postTitle,
        username,
        requestData.text,
        requestid,
        contact,
        status,
        userData._id,
        postData._id,
      ];
    };

    const reqsData = [];
    for (const requestid of requests) {
      const data = await getData(requestid);
      reqsData.push(data);
    }
    res.status(200).json(reqsData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET OUTGOING REQUESTS DATA FOR A USER
router.post("/", async (req, res) => {
  const userid = req.user.id;

  try {
    const requests = await Request.find({ userid: userid });
    const getData = async (request) => {
      const post = await Post.findById(request.postid);
      const title = post.title;
      const date = request.updatedAt;
      const text = request.text;
      const status = request.status;
      const posterData = await User.findById(post.userid);
      const contact = posterData.email;
      return [
        title,
        date,
        text,
        status,
        contact,
        post._id,
        request._id,
        posterData._id,
      ];
    };

    const reqsData = [];
    for (const request of requests) {
      const data = await getData(request);
      reqsData.push(data);
    }
    res.status(200).json(reqsData);
  } catch (err) {
    console.log(err);
  }
});

//GET REQUEST
router.get("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    res.status(200).json(request);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//APPROVE REQUEST
router.post("/approve/:id", async (req, res) => {
  try {
    const updatedReq = await Request.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: "approved" },
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
        status: "approved",
        requestid: requestid,
      };
    };
    const data = await getData(req.params.id);
    const reqId = updatedReq.userid;
    const user = await User.findByIdAndUpdate(
      reqId,
      {
        $push: { notifications: data },
      },
      { new: true }
    );
    const email = user.email;
    res.status(200).json(email);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

const declineReq = async (id) => {
  const updatedReq = await Request.findByIdAndUpdate(
    id,
    {
      $set: { status: "declined" },
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
      status: "declined",
      requestid: requestid,
    };
  };
  const data = await getData(id);
  const reqId = updatedReq.userid;
  const user = await User.findByIdAndUpdate(
    reqId,
    {
      $push: { notifications: data },
    },
    { new: true }
  );
  return data;
};

//DECLINE REQUEST
router.post("/decline/:id", async (req, res) => {
  try {
    const data = await declineReq(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//SUCCESSFUL TRANSACTION
router.post("/success/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const p1 = async () =>
      Promise.all(post.requests.map((item) => declineReq(item)));
    const p2 = async () =>
      Promise.all(post.requests.map((item) => Request.findByIdAndDelete(item)));

    p1().then(() =>
      p2().then(async () => {
        const post = await Post.findById(req.params.id);
        const oldId = post._id;
        const originalDate = post.updatedAt;
        const title = post.title;
        const desc = post.desc;
        const userid = post.userid;
        const category = post.category;
        const image = post.image;
        const location = {
          label: post.location.label,
          lat: Number(post.location.lat),
          lon: Number(post.location.lon),
        };
        await archivedPost.create({
          oldId,
          originalDate,
          title,
          desc,
          userid,
          category,
          image,
          location,
        });
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Success!");
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//UNSUCCESSFUL TRANSACTION
router.post("/fail/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    const id = JSON.stringify(request._id);
    let post = await Post.findById(request.postid)
    let requests = post.requests
    requests = requests.filter(
      (ele) => {
        return (JSON.stringify(ele) !== id )
      })
    post = await Post.findByIdAndUpdate(
      request.postid,
      {
        $set: { requests: requests },
      },
      { new: true }
    );
    await Request.findByIdAndDelete(req.params.id);
    res.status(200).json("Interaction successful");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
