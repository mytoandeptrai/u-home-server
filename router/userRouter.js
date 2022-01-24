const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");

router.route("/user").get(userCtrl.getUser).patch(userCtrl.editUser);

module.exports = router;
