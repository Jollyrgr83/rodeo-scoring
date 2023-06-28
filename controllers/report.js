// const db = require("../models");

module.exports = {
    /* controller for upcoming pdf report download functionality */
    retrieveReport: (req, res) => {
        res.setHeader("Content-Type: application/pdf");
        res.setHeader("Content-Disposition: attachment; filename=report.pdf");
        res.download("./output/report.pdf");
    }
};