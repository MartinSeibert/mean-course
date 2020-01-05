const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // split on the whitespace because the auth token will be denoted with "Bearer {token}" as is convention
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'secret_this_should_be_replaced');
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
}
