import express from "express";
import userRoute from "./Routes/userRoute";
import tweetRoute from "./Routes/tweetRoute";
import authRoute from "./Routes/authRoute";
const app = express();
app.use(express.json());
app.use("/user", userRoute);
app.use("/tweet", tweetRoute);
app.use("/auth", authRoute);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("server ready at localhost:3000");
});
