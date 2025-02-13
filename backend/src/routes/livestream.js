import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const router = express.Router();

router.post("/getStream", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`, 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "my first stream", 
    }),
  };

  try {
    const response = await fetch("https://livepeer.studio/api/stream", options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
