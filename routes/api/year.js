const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/year */
router.route("/all/").get(Controller.year.getAll);

router.route("/").post(Controller.year.add);

router.route("/").delete(Controller.year.delete);

router.route("/").put(Controller.year.update);

module.exports = router;