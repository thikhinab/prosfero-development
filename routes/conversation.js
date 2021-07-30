const router = require("express").Router();
const Conversation = require("../models/conversation");

// Create new conversation
router.post("/", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (conversation.length === 0) {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });

      try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(200).json("already in conversation");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get new conversation of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
