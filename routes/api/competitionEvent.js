const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/competitionEvent */
router.route("/active/yearID/:year_id/competitionTierID/:competition_tier_id").get(Controller.competitionEvent.getActiveCompetitionEvents);

router.route("/").delete(Controller.competitionEvent.delete);

router.route("/").post(Controller.competitionEvent.add);

module.exports = router;