const mongoose = require("mongoose");
const db = require("../models");

// const connectionUrl = "mongodb+srv://Cluster09960:bmVkUHVaTGto@cluster09960.w2t3fr0.mongodb.net/?retryWrites=true&w=majority";

const connectionUrl = process.env.ATLAS_CONNECTION_STRING_1 + process.env.ATLAS_USERNAME + process.env.ATLAS_CONNECTION_STRING_2 + process.env.ATLAS_PASSWORD + process.env.ATLAS_CONNECTION_STRING_3;

mongoose.connect(connectionUrl);

const seeds = require("./seeds");

const clearAndReseedDatabase = async () => {
    /* remove existing entries */
    await db.CompetitionEvent.deleteMany({});
    await db.CompetitionTier.deleteMany({});
    await db.Competitor.deleteMany({});
    await db.Event.deleteMany({});
    await db.Organization.deleteMany({});
    await db.Score.deleteMany({});
    await db.Tier.deleteMany({});
    await db.Year.deleteMany({});

    /* insert independent items */
    const events = await db.Event.insertMany(seeds.event);
    const organizations = await db.Organization.insertMany(seeds.organization);
    const tiers = await db.Tier.insertMany(seeds.tier);
    const years = await db.Year.insertMany(seeds.year);

    /* insert dependent items */

    /* add competitionTiers (2021 - 2, 2022 - 3, 2023 - 4 */
    const competitionTierSeed = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < i + 2; j++) {
            competitionTierSeed.push(
                {
                    tierID: tiers[j]._id,
                    yearID: years[i]._id
                }
            );
        }
    }
    const competitionTiers = await db.CompetitionTier.insertMany(competitionTierSeed);

    /* add competitionEvents (5 for each tier) */
    const competitionEventSeed = [];
    let offset = [0, 5, 10];
    let offsetIndex = 0;
    for (let i = 0; i < competitionTiers.length; i++) {
        for (let j = offset[offsetIndex]; j < offset[offsetIndex] + 5; j++) {
            competitionEventSeed.push(
                {
                    yearID: competitionTiers[i].yearID,
                    competitionTierID: competitionTiers[i]._id,
                    eventID: events[j]._id
                }
            );
        }
        offsetIndex = (offsetIndex >= 2) ? 0 : offsetIndex + 1;
    }
    const competitionEvents = await db.CompetitionEvent.insertMany(competitionEventSeed);

    /* add competitors (min 5 for each tier) */
    const competitorSeed = seeds.competitor;
    let orgCounter = 0;
    let compOffset = 0;
    for (let i = 0; i < competitionTiers.length; i++) {
        competitorSeed[compOffset].yearID = competitionTiers[i].yearID;
        competitorSeed[compOffset].competitionTierID = competitionTiers[i]._id;
        competitorSeed[compOffset].organizationID = organizations[orgCounter]._id;

        orgCounter = (orgCounter + 1 >= organizations.length) ? 0 : orgCounter + 1;

        competitorSeed[compOffset + 1].yearID = competitionTiers[i].yearID;
        competitorSeed[compOffset + 1].competitionTierID = competitionTiers[i]._id;
        competitorSeed[compOffset + 1].organizationID = organizations[orgCounter]._id;

        orgCounter = (orgCounter + 1 >= organizations.length) ? 0 : orgCounter + 1;

        competitorSeed[compOffset + 2].yearID = competitionTiers[i].yearID;
        competitorSeed[compOffset + 2].competitionTierID = competitionTiers[i]._id;
        competitorSeed[compOffset + 2].organizationID = organizations[orgCounter]._id;

        orgCounter = (orgCounter + 1 >= organizations.length) ? 0 : orgCounter + 1;

        competitorSeed[compOffset + 3].yearID = competitionTiers[i].yearID;
        competitorSeed[compOffset + 3].competitionTierID = competitionTiers[i]._id;
        competitorSeed[compOffset + 3].organizationID = organizations[orgCounter]._id;

        orgCounter = (orgCounter + 1 >= organizations.length) ? 0 : orgCounter + 1;

        competitorSeed[compOffset + 4].yearID = competitionTiers[i].yearID;
        competitorSeed[compOffset + 4].competitionTierID = competitionTiers[i]._id;
        competitorSeed[compOffset + 4].organizationID = organizations[orgCounter]._id;

        orgCounter = (orgCounter + 1 >= organizations.length) ? 0 : orgCounter + 1;
        compOffset = compOffset + 5;
    }
    const competitors = await db.Competitor.insertMany(competitorSeed);

    /* add scores */

    /* parse competitionEvents and competitors into matching competitionTiers */
    const competitionTierData = {};
    for (let i = 0; i < competitionTiers.length; i++) {
        competitionTierData[competitionTiers[i]._id] = {competitionEvents: [], competitors: []};
    }
    for (let i = 0; i < competitionEvents.length; i++) {
        competitionTierData[competitionEvents[i].competitionTierID].competitionEvents.push(competitionEvents[i]);
    }
    for (let i = 0; i < competitors.length; i++) {
        competitionTierData[competitors[i].competitionTierID].competitors.push(competitors[i]);
    }

    const scoreSeed = [];
    for (let i = 0; i < competitionTiers.length; i++) {
        let competitionTierIndex = competitionTierData[competitionTiers[i]._id];
        for (let j = 0; j < competitionTierIndex.competitionEvents.length; j++) {
            for (let k = 0; k < competitionTierIndex.competitors.length; k++) {
                scoreSeed.push({
                    yearID: competitionTierIndex.competitors[k].yearID,
                    eventID: competitionTierIndex.competitionEvents[j].eventID,
                    competitorID: competitionTierIndex.competitors[k]._id,
                    competitionTierID: competitionTiers[i]._id,
                    competitionEventID: competitionTierIndex.competitionEvents[j]._id,
                    organizationID: competitors[k].organizationID,
                    score: Math.floor(Math.random() * 100),
                    timeMinutes: Math.floor(Math.random() * 5),
                    timeSeconds: Math.floor(Math.random() * 60)
                });
            }
        }
    }
    const scores = await db.Score.insertMany(scoreSeed);

    process.exit(0);
}

clearAndReseedDatabase();