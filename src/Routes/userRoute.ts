import { Router } from "express";

const router = Router();

//users

//user create
router.post("/", (req, res) => {
  res.status(501).json({ Error: "Not Implemented" });
});

//users list
router.get("/", (req, res) => {
  res.status(501).json({ Error: "Not Implemented" });
});

//get user
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ Error: `Not Implemented:${id}` });
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
