const router = require("express").Router();

const competitionEventRoutes = require("./competitionEvent");
const competitionTierRoutes = require("./competitionTier");
const competitorRoutes = require("./competitor");
const eventRoutes = require("./event");
const organizationRoutes = require("./organization");
const reportRoutes = require("./report");
const scoreRoutes = require("./score");
const tierRoutes = require("./tier");
const yearRoutes = require("./year");


router.use("/competitionEvent", competitionEventRoutes);
router.use("/competitionTier", competitionTierRoutes);
router.use("/competitor", competitorRoutes);
router.use("/event", eventRoutes);
router.use("/organization", organizationRoutes);
router.use("/report", reportRoutes);
router.use("/score", scoreRoutes);
router.use("/tier", tierRoutes);
router.use("/year", yearRoutes);


module.exports = router;