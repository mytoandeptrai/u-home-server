const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../mailer");

const authCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const userName = await Users.findOne({ username });

      if (userName) {
        return res
          .status(400)
          .json({ msg: "This user name is already exists ! " });
      }

      const userEmail = await Users.findOne({ email });

      if (userEmail) {
        return res.status(400).json({ msg: "This email is already exists ! " });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        username,
        email,
        password: passwordHash,
      });

      await newUser.save();

      res.json({ msg: "Register successfull" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "This email does not exist !" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "This password is incorrect ! " });
      }

      const accessToken = createAccessToken({ id: user._id });

      res.json({
        msg: "Login Successfull",
        accessToken,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token)
        return res.status(400).json({ msg: "Please login now." });
      jwt.verify(
        refresh_token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: "Please login now." });
          }

          const user = await Users.findById(result.id);
          if (!user) {
            return res.status(400).json({ msg: "This does not exist." });
          }

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.body.email });

      if (!user) {
        return res.status(400).json({ msg: "This email does not exist." });
      }
      const accessToken = createAccessToken({ id: user._id });
      const url = `${process.env.CLIENT_URL}/reset/${accessToken}`;
      const htmlResult = `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Uhome Admin Page.</h2>
      <p>Congratulations! You're almost set to start using my website.
          Just click the button below to validate your email address.
      </p>
      
      <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: block; text-align: center;">Click here !</a>
  
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  
      <div>${url}</div>
      <p>If you have any questions about our website, you can also click on the link below to contact us:</p>
      <a href="https://www.facebook.com/bito.hihi/" style="text-decoration: none;padding: 10px 20px; display: inline-block">https://www.facebook.com/bito.hihi/</a>
      </div>`;

      await mailer.sendMail(req.body.email, "Reset your password", htmlResult);

      res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token) {
        return res.status(400).json({ msg: "Invalid Authentication" });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decoded) {
        return res.status(400).json({ msg: "Invalid Authentication" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Your password must be at least 6 characters" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: decoded.id },
        {
          password: passwordHash,
        },
        { new: true }
      );

      res.json({ msg: "Password successfully changed,please login again !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = authCtrl;
