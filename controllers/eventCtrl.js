const Events = require("../models/eventModel");

const eventCtrl = {
  getEvent: async (req, res) => {
    try {
      const event = await Events.findById(req.body.idEvent);

      if (!event) return res.status(400).json({ msg: "Event does not exist." });

      res.json({ event });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const { _limit, _percentage, _time, _keyword } = req.body;

      if (!_percentage && !_time && !_keyword) {
        const events = await Events.find()
          .limit(parseInt(_limit))
          .sort("-createdAt");
        res.json(events);
      } else {
        const events = await Events.find(
          _percentage && _keyword
            ? {
                percentSale: { $lte: parseInt(_percentage) },
                title: { $regex: _keyword },
              }
            : _percentage
            ? { percentSale: { $lte: parseInt(_percentage) } }
            : { title: { $regex: _keyword } }
        )
          .limit(parseInt(_limit))
          .sort({ createdAt: _time ? _time : -1 });
        res.json(events);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createNewEvent: async (req, res) => {
    try {
      const {
        title,
        description,
        worker,
        createdBy,
        startDate,
        endDate,
        percentSale,
        maxValue,
        minValue,
        condition,
      } = req.body;

      const event = await Events.findOne({ title });

      if (event) {
        return res.status(400).json({ msg: "This event is already exists ! " });
      }

      const newEvent = new Events({
        title,
        description,
        worker,
        createdBy,
        startDate,
        endDate,
        percentSale,
        maxValue,
        minValue,
        condition,
      });

      await newEvent.save();

      res.json({
        msg: "Created New Events Successfully!",
        newEvent: {
          ...newEvent._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateEvent: async (req, res) => {
    try {
      const {
        title,
        description,
        worker,
        createdBy,
        startDate,
        endDate,
        percentSale,
        maxValue,
        minValue,
        condition,
        _idEvent,
      } = req.body;

      const newEvent = await Events.findOneAndUpdate(
        { _id: _idEvent },
        {
          title,
          description,
          worker,
          createdBy,
          startDate,
          endDate,
          percentSale,
          maxValue,
          minValue,
          condition,
        },
        {
          new: true,
        }
      );

      res.json({
        msg: "Update Event Successfully!",
        newEvent: {
          ...newEvent._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteEvent: async (req, res) => {
    try {
      const deletedEvent = await Events.findOneAndDelete({
        _id: req.body._idEvent,
      });

      res.json({
        msg: "Delete Event Successfully!",
        deletedEvent: {
          ...deletedEvent._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = eventCtrl;
