const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send(`Unauthorized`);
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    const { userId } = jwt.verify(token, process.env.jwtSecret);

    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send(`Unauthorized`);
  }
};
