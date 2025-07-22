const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const keys = {
  "ABC123": {
    hwid: "hwid-456",
    userIds: ["87654321"],
    createdAt: Date.now(),
    duration: 86400,
    blacklisted: false
  },
};

app.post("/verify", (req, res) => {
  const { key, hwid, userid } = req.body;

  const keyData = keys[key];
  if (!keyData) return res.json({ authorized: false, reason: "invalid key" });

  if (keyData.blacklisted) {
    return res.json({ authorized: false, reason: "blacklisted" });
  }

  const expiresAt = keyData.createdAt + keyData.duration * 1000;
  const now = Date.now();
  if (now > expiresAt) {
    return res.json({ authorized: false, reason: "expired" });
  }

  const hwidMatch = keyData.hwid === hwid;
  const userIdMatch = keyData.userIds.includes(userid);

  if (hwidMatch && userIdMatch) {
    const timeLeft = Math.floor((expiresAt - now) / 1000);
    return res.json({
      authorized: true,
      expiresIn: timeLeft
    });
  }

  return res.json({
    authorized: false,
    reason: "hwid or userid mismatch"
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
