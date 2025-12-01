const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const userID = req.cookies.app_user_id;

    if (!userID) {
      return res.status(401).json({ ok: false, msg: "user not logged in !" });
    }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(401).json({ ok: false, msg: "invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error occures in user Authentication :", error);
    return res
      .status(500)
      .json({
        ok: "false",
        msg: "Error occures in user Authentication",
        error: error.message,
      });
  }
};

module.exports = userAuth;
