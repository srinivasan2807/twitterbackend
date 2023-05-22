import { PrismaClient, User } from "@prisma/client";
import { Router, Request } from "express";
import jwt from "jsonwebtoken";
const router = Router();
const pclient = new PrismaClient();
type userRequest = Request & { user?: User };

//Tweet

//tweet create
router.post("/", async (req: userRequest, res) => {
  const { content, image } = req.body;
  //authentication

  const user = req.user;
  if (!user) {
    return res.sendStatus(401);
  }
  try {
    const result = await pclient.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "username or email already exists" });
  }
});
//Tweet list
router.get("/", async (req, res) => {
  try {
    const allTweets = await pclient.tweet.findMany({
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    });
    res.status(200).json(allTweets);
  } catch (error) {
    res.status(400).json({ Error: "something went wrong" });
  }
});

//get tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweetResult = await pclient.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!tweetResult) {
    return res.status(404).json({ Error: "Oops no such tweet found!" });
  }
  res.status(200).json(tweetResult);
});
//update tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;
  try {
    const result = await pclient.tweet.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
      },
    });
    res.status(200).json({ Success: `${result}` });
  } catch (error) {
    res.status(400).json({ Error: `Tweet not updated` });
  }
});

//delete tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pclient.tweet.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ Error: `user not found in our directory` });
  }
});

export default router;
