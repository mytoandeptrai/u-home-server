const router = require("express").Router();
const eventCtrl = require("../controllers/eventCtrl");

router
  .route("/events")
  .get(eventCtrl.getAllEvents)
  .post(eventCtrl.createNewEvent);

router
  .route("/event")
  .get(eventCtrl.getEvent)
  .patch(eventCtrl.updateEvent)
  .delete(eventCtrl.deleteEvent);

module.exports = router;
