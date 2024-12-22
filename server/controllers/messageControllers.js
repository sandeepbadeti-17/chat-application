const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//Get all Messages
//GET -> /api/Message/:chatId
//access Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//Create New Message
//POST -> /api/Message/
//access Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  const userId = req.user._id;
  if (!content || !chatId || !userId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    // const chat = await Chat.findById(chatId);
    // if (!chat) {
    //   return res.status(404).json({ message: "Chat not found" });
    // }

    // await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // res.json(message);
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
