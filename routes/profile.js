const router = require("express").Router();
let UserModel = require("../models/user");
require("../auth/auth");

//GET USER PROFILE
router.get("/", async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const { password, updatedAt, ...data } = user._doc;
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User not found" });
  }
});

//UPDATE USER PROFILE
router.put("/", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } catch (err) {
    console.log(error);
    res.status(500).json(error);
  }
});

//DELETE USER
router.delete("/", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.user.id);
    res.status(200).json("Account has been deleted");
  } catch (err) {
    console.log(error);
    res.status(500).json(error);
  }
});

//GET NOTIFICATIONS
router.get("/notifs", async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const notifs = user.notifications;
    res.json(notifs);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User not found" });
  }
});

//DELETE NOTIFI
router.post("/notifs/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { notifications: { requestid: req.params.id } },
      },
      { new: true }
    );
    res.status(200).json("success");
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User not found" });
  }
});

//GET OTHER USER DATA
router.get("/data/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const { password, updatedAt, ...data } = user._doc;
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
