const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/organization */
router.route("/all/").get(Controller.organization.getAll);

router.route("/active/yearID/:year_id").get(Controller.organization.getOrganizationsByYearId);

router.route("/").post(Controller.organization.add);

router.route("/").delete(Controller.organization.delete);

router.route("/").put(Controller.organization.update);

module.exports = router;