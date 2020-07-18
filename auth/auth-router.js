const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { insert, findBy } = require("../users/users-model");
const { generateToken } = require("./auth-service");

router.post("/register", async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password is required" });
  }

  try {
    password = await bcrypt.hash(password, 12);
    let user = await insert({ username, password });
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: "Unable to register new user" });
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password is required" });
  }
  try {
    let user = await findBy({ username }).first();

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid username and/or password" });
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid username and/or password" });
    }
    const token = generateToken(user);
    res.status(200).json({ message: "Welcome to our API", token });
  } catch (e) {
    res.status(500).json({ message: "Unable to login user" });
  }
});

module.exports = router;
