const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.post("/refresh_token", authCtrl.generateAccessToken);

router.post("/forgot", authCtrl.forgotPassword);

router.post("/resetPassword", authCtrl.resetPassword);

module.exports = router;
