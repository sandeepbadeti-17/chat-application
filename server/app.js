const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlerware/errorMiddleware");
const path = require('path')
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //to accept the json data
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Chat Backend is Running!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// deployment---------------------------------------------------------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------------------------------------------------------------

//error middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const CLIENT = process.env.CLIENT || "http://localhost:5173";
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// socket connection
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: CLIENT,
  },
});

io.on("connection", (socket)=>{
    console.log("Connected to socket.io")

    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room)=>{
        socket.join(room)
        console.log("User joined room", room)
    })

    socket.on("new message", (newMessageReceived)=>{
        let chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.user is not defined");

        chat.users.forEach(user => {
            if(user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
        });
        
    })

    socket.on("leave chat", (room) => {
      console.log(`User left room ${room}`);
      socket.leave(room);
  });

    socket.off("setup",()=>{
      console.log("User disconnected")
      socket.leave(userData._id)
    })
})
