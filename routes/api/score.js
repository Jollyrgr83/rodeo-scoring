const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/score */
router.route("/all/").get(Controller.score.getAll);

router.route("/competitorID/:competitor_id").get(Controller.score.getScoreByCompetitor);

router.route("/report/yearID/:year_id/reportType/:report_type/organizationID/:organization_id/competitionTierID/:competition_tier_id/eventID/:event_id").get(Controller.score.getReport);

router.route("/reconcile/:competitor_id").get(Controller.score.reconcile);

router.route("/").post(Controller.score.add);

router.route("/").delete(Controller.score.delete);

router.route("/").put(Controller.score.update);

module.exports = router;