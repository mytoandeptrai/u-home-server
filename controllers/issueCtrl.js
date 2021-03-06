const Issues = require("../models/issueModel");

const issueCtrl = {
  getIssue: async (req, res) => {
    try {
      const Issue = await Issues.findById(req.query.idIssue);

      if (!Issue) return res.status(400).json({ msg: "Issue does not exist." });

      res.json({ Issue });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllIssues: async (req, res) => {
    try {
      const _limit = parseInt(req.query._limit) || 12;
      const _keyword = req.query._keyword || "";
      const _status = req.query._status || "";

      if (!_status && !_keyword) {
        const issues = await Issues.find().limit(parseInt(_limit));
        res.json(issues);
      } else {
        const issues = await Issues.find(
          _status && _keyword
            ? { status: _status, title: { $regex: _keyword } }
            : _status
            ? { status: _status }
            : { title: { $regex: _keyword } }
        ).limit(parseInt(_limit));
        res.json(issues);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createNewIssue: async (req, res) => {
    try {
      const { title, location, categories, payment_method, status } = req.body;

      const issue = await Issues.findOne({ title });

      if (issue) {
        return res.status(400).json({ msg: "This title is already exists ! " });
      }

      const newIssue = new Issues({
        title,
        location,
        categories,
        payment_method,
        status,
      });

      await newIssue.save();

      res.json({
        msg: "Created New Issue Successfully!",
        newIssue: {
          ...newIssue._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = issueCtrl;
