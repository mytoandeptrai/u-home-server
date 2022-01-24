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
  editUser: async (req, res) => {
    try {
      const { avatar, username, email, _id } = req.body;

      const user = await Users.findOneAndUpdate(
        { _id },
        { username, avatar, email },
        { new: true }
      );

      res.json({ msg: "Update successfully", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
