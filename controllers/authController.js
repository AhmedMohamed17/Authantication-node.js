const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await User.findOne({ email: email }).exec();
    if (foundUser) {
      res.status(401).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 2);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "18d" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "17d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({
      accessToken,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
      res.status(401).json({ message: "User does not exist" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      res.status(401).json({ message: "Wrong Password" });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "18d" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "17d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({
      accessToken,
      email: foundUser.email,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const refresh = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          res.status(403).json({ message: "Forbidden" });
        }
        const foundUser = await User.findById(decoded.UserInfo.id);
        if (!foundUser) {
          res.status(401).json({ message: "unauthorized" });
        }
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser._id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "12d" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const logout = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      res.sendStatus(204); //No Content
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.json({ message: "cookie is cleared " });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
module.exports = {
  register,
  login,
  refresh,
  logout,
};
