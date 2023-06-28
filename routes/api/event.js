const router = require("express").Router();
const Controller = require("../../controllers");

/* base url: /api/event */
router.route("/all/").get(Controller.event.getAll);

router.route("/").post(Controller.event.add);

router.route("/").delete(Controller.event.delete);

router.route("/").put(Controller.event.update);

module.exports = router;