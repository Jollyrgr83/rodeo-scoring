const competitor = require("./competitor");
const event = require("./event");
const organization = require("./organization");
const tier = require("./tier");
const year = require("./year");

const seeds = {
    competitor: competitor,
    event: event,
    organization: organization,
    tier: tier,
    year: year
};

module.exports = seeds;