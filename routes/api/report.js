const router = require("express").Router();
const Controller = require("../../controllers");
const fs = require("fs");

/* base url: /api/report */
router.route("/retrieve-report").get(Controller.report.retrieveReport);

module.exports = router;