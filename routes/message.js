const router = require("express").Router();
const Message = require("../models/message");

//CREATE MESSAGE
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET MESSAGE
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
