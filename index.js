const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const keys = {
  "ABC123": {
    HWID: "hwid-456",
    UserIds: ["12345678", "87654321"],
    createdAt: Date.now()
  }
};

app.post("/verify", (req, res) => {
  console.log("Received:", req.body);

  const { key, hwid, userid } = req.body;

  const data = keys[key];
  if (!data) return res.status(403).json({ authorized: false, reason: "Invalid key" });

  const now = Date.now();
  const durationMs = 86400000;

  if (now - data.createdAt > durationMs) {
    return res.status(403).json({ authorized: false, reason: "Key expired" });
  }

  if (data.HWID !== hwid) {
    return res.status(403).json({ authorized: false, reason: "HWID mismatch" });
  }

  if (!data.UserIds.includes(userid)) {
    return res.status(403).json({ authorized: false, reason: "UserId mismatch" });
  }

  return res.json({ authorized: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
