const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/report */

/* route used for upcoming pdf download of report */
router.route("/retrieve-report").get(Controller.report.retrieveReport);

module.exports = router;