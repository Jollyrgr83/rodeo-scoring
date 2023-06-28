const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/competitionTier */
router.route("/all/").get(Controller.competitionTier.getAll);

router.route("/one/:competition_tier_id").get(Controller.competitionTier.getCompetitionTierById);

router.route("/many/:param/:value").get(Controller.competitionTier.getCompetitionTiersByParam);

router.route("/full/:year_id").get(Controller.competitionTier.getFullCompetitionTiersByYearId);

router.route("/open/:year_id").get(Controller.competitionTier.getOpenTiersByYearId);

router.route("/named/:year_id").get(Controller.competitionTier.getNamedCompetitionTiersByYearId)

router.route("/active/yearID/:year_id/organizationID/:organization_id").get(Controller.competitionTier.getActiveCompetitionTiers);

router.route("/").post(Controller.competitionTier.add);

router.route("/").delete(Controller.competitionTier.delete);

router.route("/").put(Controller.competitionTier.update);

module.exports = router;