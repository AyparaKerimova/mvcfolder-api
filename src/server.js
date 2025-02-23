require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { createServer } = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const listRoutes = require("./routes/listRoutes");

const app = express();
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://netflix-iota-sable.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/series", seriesRoutes);
app.use("/api/v1/list", listRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

let chatHistory = []; 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("User ID:", userId);

  socket.on("sendMessage", (message) => {
    chatHistory.push(message);
    io.emit("receiveMessage", message); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
