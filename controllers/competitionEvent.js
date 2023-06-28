const db = require("../models");

module.exports = {
    getActiveCompetitionEvents: (req, res) => {
        const yearID = req.params.year_id;
        const competitionTierID = req.params.competition_tier_id;
        const getEvents = async (yearID, competitionTierID) => {
            const competitionEvents = await db.CompetitionEvent.find({yearID: yearID, competitionTierID: competitionTierID});
            if (competitionEvents.length === 0) {
                return [{empty: true}];
            } else {
                const data = [];
                const competitionTierDoc = await db.CompetitionTier.findById(competitionTierID);
                const tierDoc = await db.Tier.findById(competitionTierDoc.tierID);
                const tierName = tierDoc.name;
                for (let i = 0; i < competitionEvents.length; i++) {
                    const newEvent = {
                        _id: competitionEvents[i]._id,
                        yearID: competitionEvents[i].yearID,
                        competitionTierID: competitionEvents[i].competitionTierID,
                        eventID: competitionEvents[i].eventID,
                        tierName: tierName
                    };
                    const eventDoc = await db.Event.findById(competitionEvents[i].eventID);
                    newEvent.name = eventDoc.name;
                    data.push(newEvent);
                }
                data.unshift({_id: "overall", tierName: tierName, name: "Overall"});
                return data;
            }
        }
        getEvents(yearID, competitionTierID).then(data => {
            res.status(200).json(data);
        }).catch(er => res.status(500).json(er));
    },
    add: (req, res) => {
        const createScores = async (competitionEvent) => {
            const competitors = await db.Competitor.find({competitionTierID: competitionEvent.competitionTierID});
            for (let i = 0; i < competitors.length; i++) {
                const newScore = {
                    eventID: competitionEvent.eventID,
                    yearID: competitionEvent.yearID,
                    competitionTierID: competitionEvent.competitionTierID,
                    competitionEventID: competitionEvent._id,
                    competitorID: competitors[i]._id,
                    organizationID: competitors[i].organizationID
                };
                await db.Score.create(newScore);
            }
        }
        db.CompetitionEvent.create({competitionTierID: req.body.competition_tier_id, eventID: req.body.event_id, yearID: req.body.year_id}).then(doc => {
            createScores(doc).then(() => {
                res.status(200).json({message: "success", doc: doc})
            });
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        db.CompetitionEvent.findById(req.body.id).then(doc => {
            db.CompetitionEvent.deleteOne({_id: doc._id}).then(r => {
                res.status(200).json({message: "success", r: r});
            }).catch(er => res.status(500).json(er));
        }).catch(er => res.status(500).json(er));
    }
};