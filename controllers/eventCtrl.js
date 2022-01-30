const Events = require("../models/eventModel");

const eventCtrl = {
  getEvent: async (req, res) => {
    try {
      const event = await Events.findById(req.query.idEvent);

      if (!event) return res.status(400).json({ msg: "Event does not exist." });

      res.json({ event });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const _limit = parseInt(req.query._limit) || 12;
      const _percentage = parseInt(req.query._percentage) || 0;
      const _keyword = req.query._keyword || "";
      const _startTime = req.query._startTime || "";
      const _endTime = req.query._endTime || "";
      const _type = req.query._type || "";

      if (
        _percentage === 0 &&
        _startTime === "" &&
        _endTime === "" &&
        _keyword === "" &&
        _type === ""
      ) {
        const events = await Events.find()
          .limit(parseInt(_limit))
          .sort("-createdAt");
        res.json(events);
      } else {
        const events = await Events.find(
          _percentage && _keyword && _startTime && _endTime && _type
            ? {
                percentSale: { $lte: parseInt(_percentage) },
                title: { $regex: _keyword },
                type: _type,
                createdAt: {
                  $gte: new Date(_startTime).toISOString(),
                  $lt: new Date(_endTime).toISOString(),
                },
              }
            : _startTime && _endTime && _startTime !== _endTime
            ? {
                createdAt: {
                  $gte: new Date(_startTime).toISOString(),
                  $lt: new Date(_endTime).toISOString(),
                },
              }
            : _percentage && _keyword && _type
            ? {
                percentSale: { $lte: parseInt(_percentage) },
                title: { $regex: _keyword },
                type: _type,
              }
            : _percentage && _keyword
            ? {
                percentSale: { $lte: parseInt(_percentage) },
                title: { $regex: _keyword },
              }
            : _percentage && _type
            ? {
                percentSale: { $lte: parseInt(_percentage) },
                type: _type,
              }
            : _percentage
            ? { percentSale: { $lte: parseInt(_percentage) } }
            : _keyword
            ? { title: { $regex: _keyword } }
            : { type: _type }
        ).limit(parseInt(_limit));
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
        type,
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
        type,
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
        _id: req.query._idEvent,
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
