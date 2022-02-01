const Users = require("../models/userModel");

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.query.idUser);

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await Users.find().sort("-createdAt");
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  editUser: async (req, res) => {
    try {
      const { avatar, username, email, role, _id } = req.body;

      const user = await Users.findOneAndUpdate(
        { _id },
        { username, avatar, email, role },
        { new: true }
      );

      res.json({ msg: "Update successfully", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
