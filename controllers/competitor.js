const db = require("../models");

module.exports = {
    getAll: (req, res) => {
        db.Competitor.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    getCompetitorsByYearId: (req, res) => {
        db.Organization.find({}).then(organizations => {
            const orgs = [...organizations];
            db.Competitor.find({yearID: req.params.year_id}).then(competitors => {
                if (competitors.length === 0) {
                    res.status(200).json([{noCompetitor: true, _id: 0}]);
                } else {
                    const data = [];
                    competitors.forEach(comp => {
                        const c = {
                            competitorNumber: comp.competitorNumber,
                            _id: comp._id.toString(),
                            organizationID: comp.organizationID.toString(),
                            competitionTierID: comp.competitionTierID.toString(),
                            yearID: comp.yearID.toString()
                        };
                        if (comp.firstName) {
                            c.firstName = comp.firstName;
                            c.lastName = comp.lastName;
                        } else {
                            c.teamName = comp.teamName;
                            c.groupNames = comp.groupNames;
                        }
                        for (let i = 0; i < orgs.length; i++) {
                            if (orgs[i]._id.toString() === comp.organizationID.toString()) {
                                c.organizationName = orgs[i].name;
                                i = orgs.length;
                            }
                        }
                        data.push(c);
                    });
                    res.status(200).json(data);
                }
            });
        });
    },
    add: (req, res) => {
        const createScores = async (competitor) => {
            const competitionEvents = await db.CompetitionEvent.find({competitionTierID: competitor.competitionTierID});
            for (let i = 0; i < competitionEvents.length; i++) {
                const newScore = {
                    eventID: competitionEvents[i].eventID,
                    yearID: competitor.yearID,
                    competitionTierID: competitor.competitionTierID,
                    competitionEventID: competitionEvents[i]._id,
                    competitorID: competitor._id,
                    organizationID: competitor.organizationID
                };
                await db.Score.create(newScore);
            }
        }
        const o = {
            competitorNumber: req.body.competitorNumber,
            organizationID: req.body.organizationID,
            competitionTierID: req.body.tierID,
            yearID: req.body.yearID
        };
        if (req.body.teamName) {
            o.teamName = req.body.teamName;
            o.groupNames = req.body.groupNames;
        } else {
            o.firstName = req.body.firstName;
            o.lastName = req.body.lastName;
        }
        db.Competitor.create(o).then(competitor => {
            createScores(competitor).then(r => {
                res.status(200).json({message: "success", r: r})
            });
        });
    },
    delete: (req, res) => {
        db.Competitor.findById(req.body.id).then(competitor => {
            db.Score.deleteMany({competitorID: competitor._id}).then(x => {
                /* delete competitor */
                db.Competitor.deleteOne({_id: competitor._id}).then(r => {
                    res.status(200).json({message: "success", r: r, x: x});
                });
            });
        });
    },
    update: (req, res) => {
        db.Competitor.findById(req.body.id).then(doc => {
            doc.competitorNumber = req.body.competitorNumber;
            if (req.body.firstName) {
                doc.firstName = req.body.firstName;
                doc.lastName = req.body.lastName;
            } else {
                doc.teamName = req.body.teamName;
                doc.groupNames = req.body.groupNames;
            }
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            })
        })
    }
};