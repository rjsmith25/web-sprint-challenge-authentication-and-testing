const secrets = require("../config/secrets");
const jwt = require("jsonwebtoken");

function restricted(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secrets.jwt_secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ you: "shall not pass!" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ you: "shall not pass!" });
  }
}

module.exports = restricted;
