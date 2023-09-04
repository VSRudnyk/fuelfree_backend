const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logger");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    logger.error("User register error: email in use");
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
  logger.info("new user created");
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    logger.fatal("No such user found");
    throw HttpError(401, "No such user found");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    logger.error("Email or password invalid");
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
    name: user.name,
    email: user.email,
  });
};

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);

    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      logger.error("Token invalid");
      throw new HttpError(401, "Token invalid");
    }

    const payload = { id };

    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    logger.error("Token invalid");
    throw new HttpError(401, "Token invalid");
  }
};

const googleAuth = async (req, res) => {
  const { _id: id } = req.user;

  const payload = {
    id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await User.findByIdAndUpdate(id, {
    accessToken,
    refreshToken,
  });

  res.redirect(
    `http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  googleAuth: ctrlWrapper(googleAuth),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  refreshToken: ctrlWrapper(refreshToken),
};
