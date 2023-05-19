import { Router } from "express";

const router = Router();

//Tweet

//tweet create
router.post("/", (req, res) => {
  res.status(501).json({ Error: "Not Implemented" });
});

//Tweet list
router.get("/", (req, res) => {
  res.status(501).json({ Error: "Not Implemented" });
});

//get tweet
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ Error: `Not Implemented:${id}` });
});
//update tweet
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ Error: `Not Implemented:${id}` });
});

//delete tweet
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ Error: `Not Implemented:${id}` });
});

export default router;
