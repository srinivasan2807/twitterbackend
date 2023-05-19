import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const client = new PrismaClient();
//users

//user create
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;
  try {
    const result = await client.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, jigglers",
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "username or email already exists" });
  }
});

//users list
router.get("/", async (req, res) => {
  const allUsers = await client.user.findMany();
  res.json(allUsers);
});

//get user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await client.user.findUnique({ where: { id: Number(id) } });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "no user found" });
  }
});
//update user
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ Error: `Not Implemented:${id}` });
});

//delete user
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ Error: `Not Implemented:${id}` });
});

export default router;
