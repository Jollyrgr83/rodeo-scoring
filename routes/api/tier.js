const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/tier */
router.route("/all/").get(Controller.tier.getAll);

router.route("/").post(Controller.tier.add);

router.route("/").delete(Controller.tier.delete);

router.route("/").put(Controller.tier.update);

module.exports = router;