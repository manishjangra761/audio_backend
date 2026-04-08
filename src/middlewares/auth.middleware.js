const jwt = require("jsonwebtoken");
const jwt_config = require("../../config/jwt.config.js");

const accessTokenSecret = jwt_config.accessTokenSecret;

exports.authenticateJWT = (req, res, next) => {

  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token missing",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, accessTokenSecret);

    // attach user to request
    req.user = decoded;
    
    next();
  } catch (err) {
    console.log(err)
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    return res.status(403).json({
      message: "Invalid access token",
    });
  }
};



exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      jwt_config.refreshTokenSecret
    );

    const payload = {
      user_id: decoded.user_id,
      role: decoded.role,
    };

    const newAccessToken = jwt.sign(
      payload,
      jwt_config.accessTokenSecret,
      { expiresIn: jwt_config.jwt_timeout }
    );

    res
      .set("Authorization", `Bearer ${newAccessToken}`)
      .status(200)
      .json({ message: "Token refreshed" });

  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
