const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");

router.route("/user").get(userCtrl.getUser).patch(userCtrl.editUser);

router.get("/users", userCtrl.getUsers);

module.exports = router;
