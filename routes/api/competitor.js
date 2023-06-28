const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/competitor */
router.route("/all/").get(Controller.competitor.getAll);

router.route("/many/yearID/:year_id").get(Controller.competitor.getCompetitorsByYearId);

router.route("/").post(Controller.competitor.add);

router.route("/").delete(Controller.competitor.delete);

router.route("/").put(Controller.competitor.update);

module.exports = router;