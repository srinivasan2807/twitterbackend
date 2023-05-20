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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, image, bio } = req.body;
  try {
    const resultUpdate = await client.user.update({
      where: { id: Number(id) },
      data: { name, image, bio },
    });
    res.status(200).json(resultUpdate);
  } catch (error) {
    res.status(400).json({ Error: `failed to update` });
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await client.user.delete({ where: { id: Number(id) } });

  res.status(200).json({ Success: `User deleted successfully` });
});

export default router;
