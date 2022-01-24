const router = require("express").Router();
const issueCtrl = require("../controllers/issueCtrl");

router
  .route("/issues")
  .get(issueCtrl.getAllIssues)
  .post(issueCtrl.createNewIssue);

router.route("/issue").get(issueCtrl.getIssue);

module.exports = router;
