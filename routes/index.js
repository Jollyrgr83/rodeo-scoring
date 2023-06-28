const path = require("path");
const router = require("express").Router();

const Err = require("../models/HttpError");

const api = require("./api");

router.use("/api", api);

/* serve react app if not accessing api routes */
router.use((req, res) => res.sendFile(path.join(__dirname, "../client/build/index.html")));
// router.use((req, res, next) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// })

module.exports = router;