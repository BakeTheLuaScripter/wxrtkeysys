const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const keys = {
  "ABC123": {
    HWID: "hwid-456",
    UserIds: ["12345678", "87654321"],
    createdAt: Date.now() // sets the current time when server starts
  }
};

app.post("/verify", (req, res) => {
  const { key, hwid, userid } = req.body;

  const data = keys[key];
  if (!data) return res.status(403).json({ authorized: false, reason: "Invalid key" });

  // Check duration (1 day = 86400000 ms)
  const now = Date.now();
  const durationMs = 86400000; // 1 day in milliseconds

  if (now - data.createdAt > durationMs) {
    return res.status(403).json({ authorized: false, reason: "Key expired" });
  }

  const hwidMatch = data.HWID === hwid;
  const userMatch = data.UserIds.includes(userid);

  if (hwidMatch && userMatch) {
    return res.json({ authorized: true });
  }

  return res.status(403).json({ authorized: false, reason: "HWID or UserId mismatch" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
