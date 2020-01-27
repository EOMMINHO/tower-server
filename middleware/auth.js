require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

function authUser(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("no token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!decoded.isAuthorized) {
      res.status(400).send("not authorized");
    } else {
      req.user = decoded;
      next();
    }
  } catch (ex) {
    res.status(400).send("invalid token");
  }
}

function authAdmin(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("no token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!decoded.isAdmin) {
      res.status(400).send("not admin");
    } else {
      req.user = decoded;
      next();
    }
  } catch (ex) {
    res.status(400).send("invalid token");
  }
}

module.exports.auth = auth;
module.exports.authUser = authUser;
module.exports.authAdmin = authAdmin;
