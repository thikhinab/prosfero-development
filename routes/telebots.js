const router = require("express").Router();
const telebot = require("../models/telebot");
const botCategory = require("../models/botCategories");
const User = require("../models/user");
const Telebot = require("../models/telebot")

//GET TELEBOT DETAILS
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const telebot = await Telebot.findOne(
      {webusername: user.username}
    )
    res.status(200).json(telebot)
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User not found" });
  }
});

//SET UP TELE USERNAME
router.post("/", async (req, res) => {
  try {
    const userid = req.user.id;
    const teleusername = req.body.username;
    const user = await User.findById(userid);
    const webusername = user.username;
    const response = await telebot.create({
      webusername,
      teleusername,
    });
    await User.findByIdAndUpdate(
      userid,
      {
        $set: {telebot: response._doc._id}
      },
      {new: true}
    );
    const { _id } = response._doc
    res.status(200).json({ id: _id });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//UPDATE TELE USERNAME
router.post("/update", async (req, res) => {
  try {
    const userid = req.user.id;
    const teleusername = req.body.username;
    const user = await User.findById(userid);
    const webusername = user.username;
    const response = await telebot.findByIdAndUpdate(
      user.telebot,
      {
      webusername,
      teleusername,
      }
    );
    await telebot.findByIdAndUpdate(
      user.telebot,
      {
        $set: {confirmed: false}
      }
    );
    
    const { _id } = response._doc;
    res.status(200).json({ id: _id });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//INITIALISE CATEGORY
router.post("/category/:cat", async (req, res) => {
  try {
    const category = req.params.cat;
    const response = await botCategory.create({
      category,
    });

    const { _id } = response._doc;
    res.status(200).json({ id: _id });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//ADD TO CATEGORY MAILING LIST
//NEED TO INITIALISE THE RECORD FOR EACH CATEGORY
router.put("/", async (req, res) => {
  const userid = req.user.id;
  const category = req.body.category;
  try {
    const user = await User.findById(userid);
    const username = user.username;
    const teleDetails = await telebot.findOne({ webusername: username });
    const chatid = teleDetails.chatid;
    const userList = await botCategory.find({
      category: category,
      users: chatid,
    });

    console.log(userList);
    if (userList.length === 0) {
      const user = await User.findByIdAndUpdate(
        userid,
        {
          $push: { botcategories: category },
        },
        { new: true }
      );
      await botCategory.findOneAndUpdate(
        {
          category: category,
        },
        { $push: { users: chatid } }
      );
      res.status(200).json("Added successfully");
    } else {
      res.status(200).json("Category already added!");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//REMOVE FROM CATEGORY MAILING LIST
router.put("/remove", async (req, res) => {
  const userid = req.user.id;
  const category = req.body.category;
  try {
    const user = await User.findByIdAndUpdate(
      userid,
      {
        $pull: { botcategories: category },
      },
      { new: true }
    );
    const username = user.username;
    const teleDetails = await telebot.findOne({ webusername: username });
    const chatid = teleDetails.chatid;
    const userList = await botCategory.find({
      category: category,
      users: chatid,
    });

    //console.log(userList);
    if (userList.length != 0) {
      await botCategory.findOneAndUpdate(
        {
          category: category,
        },
        { $pull: { users: chatid } }
      );
      res.status(200).json("Removed successfully");
    } else {
      res.status(200).json("Currently not subscribed to this category!");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//SET LOCATION
router.post("/location", async (req, res) => {
  try {
    console.log(req.body.location)
    const userid = req.user.id;
    const location = {
      label: req.body.location.label,
      lat: Number(req.body.location.lat),
      lon: Number(req.body.location.lon),
    };
    const user = await User.findByIdAndUpdate(
      userid,
      {
        $set: {location: location}
      },
      {new: true}
    );
    console.log(user)
    res.status(200).json("Location set!");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
