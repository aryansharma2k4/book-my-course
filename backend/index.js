const express = require("express");
const app = express();

const PORT = 5000; // You can change the port if needed

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
