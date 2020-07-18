const router = require("express").Router();

const { find } = require("./users-model.js");

// get all users
router.get("/", async (req, res) => {
  try {
    let users = await find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: "unable to get Users" });
  }
});

module.exports = router;
