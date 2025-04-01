const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeaders = req.headers;
  const authHeader = req.headers.authorization || req.headers.Authorization; //"Bearer token"
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1]; // ["Bearer","token"]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded.UserInfo.id;
    next();
  });
};

module.exports = verifyJWT;
