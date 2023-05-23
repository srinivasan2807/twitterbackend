import express from "express";
import userRoute from "./Routes/userRoute";
import tweetRoute from "./Routes/tweetRoute";
import authRoute from "./Routes/authRoute";
import { authenticateToken } from "./middlewares/authMiddleware";
const app = express();
app.use(express.json());
app.use("/user", authenticateToken, userRoute);
app.use("/tweet", authenticateToken, tweetRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("server ready at localhost:3000");
});
