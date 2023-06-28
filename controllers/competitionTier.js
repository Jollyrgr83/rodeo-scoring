const db = require("../models");

module.exports = {
    getAll: (req, res) => {
        db.CompetitionTier.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    getCompetitionTierById: (req, res) => {
        db.CompetitionTier.findById(req.params.competition_tier_id).then(doc => {
            res.status(200).json([doc])
        }).catch(er => res.status(422).json(er));
    },
    getCompetitionTiersByParam: (req, res) => {
        const searchTerms = {};
        searchTerms[req.params.param] = req.params.value;
        db.CompetitionTier.find(searchTerms).then(data => {
            if (data.length === 0) {
                res.status(200).json([{empty: true}]);
            } else {
                res.status(200).json(data);
            }
        }).catch(er => res.status(500).json(er));
    },
    getFullCompetitionTiersByYearId: (req, res) => {
        const d = {};
        db.Tier.find({}).then(tiers => {
            d.tiers = [...tiers];
            db.Event.find({}).then(events => {
                d.events = [...events];
                db.CompetitionTier.find({yearID: req.params.year_id}).then(competitionTiers => {
                    d.competitionTiers = [...competitionTiers];
                    db.CompetitionEvent.find({yearID: req.params.year_id}).then(competitionEvents => {
                        d.competitionEvents = [...competitionEvents];
                        if (d.competitionTiers.length > 0) {
                            const returnArray = [];
                            d.competitionTiers.forEach(compTier => {
                                const compTierObj = {_id: compTier._id, name: "", events: [], addEvents: []};
                                /* set name */
                                for (let i = 0; i < d.tiers.length; i++) {
                                    if (d.tiers[i]._id.toString() === compTier.tierID.toString()) {
                                        compTierObj.name = d.tiers[i].name;
                                        i = d.tiers.length;
                                    }
                                }
                                /* set competitionEvents */
                                d.competitionEvents.forEach(compEv => {
                                    let isCompTierIdEqual = false;
                                    if (compEv.competitionTierID.toString() === compTierObj._id.toString()) {
                                        const competitionEventObj = {
                                            _id: compEv._id.toString(),
                                            competitionTierID: compEv.competitionTierID.toString(),
                                            yearID: compEv.yearID.toString(),
                                            eventID: compEv.eventID.toString()
                                        };
                                        compTierObj.events.push(competitionEventObj);
                                    }
                                })
                                /* set addEvents and competitionEvents names */
                                d.events.forEach(ev => {
                                    let indexToggle = false;
                                    for (let i = 0; i < compTierObj.events.length; i++) {
                                        if (compTierObj.events[i].eventID.toString() === ev._id.toString()) {
                                            indexToggle = true;
                                            compTierObj.events[i].name = ev.name;
                                            i = d.competitionEvents.length;
                                        }
                                    }
                                    if (!indexToggle) {
                                        compTierObj.addEvents.push(ev);
                                    }
                                });
                                returnArray.push(compTierObj);
                            });
                            res.status(200).json(returnArray);
                        } else {
                            res.status(200).json([{empty: true, _id: "empty", name: "Add a competition tier", events: [], addEvents: []}]);
                        }
                    });
                });
            });
        });
    },
    getOpenTiersByYearId: (req, res) => {
        db.CompetitionTier.find({ yearID: req.params.year_id }).then(competitionTiers => {
            db.Tier.find({}).then(tiers => {
                const returnData = {};
                if (competitionTiers.length > 0 && tiers.length > 0) {
                    let returnItems = [];
                    for (let i = 0; i < tiers.length; i++) {
                        let tierToggle = true;
                        for (let j = 0; j < competitionTiers.length; j++) {
                            if (competitionTiers[j].tierID.toString() === tiers[i]._id.toString()) {
                                tierToggle = false;
                                j = competitionTiers.length;
                            }
                        }
                        if (tierToggle) {
                            returnItems.push(tiers[i]);
                        }
                    }
                    returnData.data = [...returnItems];
                } else {
                    returnData.data = [...tiers];
                }
                res.status(200).json(returnData);
            });
        });
    },
    getNamedCompetitionTiersByYearId: (req, res) => {
        db.CompetitionTier.find({yearID: req.params.year_id}).then(data => {
            if (data.length === 0) {
                res.status(200).json([{noTier: true}]);
            } else {
                db.Tier.find({}).then(tiers => {
                    const returnData = [];
                    data.forEach(competitionTier => {
                        const competitionTierObject = {
                            _id: competitionTier._id.toString(),
                            yearID: competitionTier.yearID.toString(),
                            tierID: competitionTier.tierID.toString()
                        };
                        for (let i = 0; i < tiers.length; i++) {
                            if (tiers[i]._id.toString() === competitionTierObject.tierID) {
                                competitionTierObject.name = tiers[i].name;
                                competitionTierObject.teamBoolean = tiers[i].teamBoolean;
                                i = tiers.length;
                            }
                        }
                        returnData.push(competitionTierObject);
                    });
                    res.status(200).json(returnData);
                });
            }
        });
    },
    getActiveCompetitionTiers: (req, res) => {
        const yearID = req.params.year_id;
        const organizationID = req.params.organization_id;
        const getTiers = async (yearID, organizationID) => {
            const competitionTiers = await db.CompetitionTier.find({yearID: yearID});
            if (organizationID !== "all") {
                const data = [];
                for (let i = 0; i < competitionTiers.length; i++) {
                    const competitors = await db.Competitor.find({competitionTierID: competitionTiers[i]._id});
                    let toggle = false;
                    for (let j = 0; j < competitors.length; j++) {
                        if (organizationID.toString() === competitors[i].organizationID.toString()) {
                            toggle = true;
                            j = competitors.length;
                        }
                    }
                    if (toggle) {
                        data.push(competitionTiers[i]);
                    }
                }
                if (data.length === 0) {
                    return [{message: "success", empty: true}];
                } else {
                    let namedData = await getNames(data);
                    return namedData;
                }
            } else {
                if (competitionTiers.length === 0) {
                    return [{message: "success", empty: true}];
                } else {
                    let namedData = await getNames(competitionTiers);
                    return namedData;
                }
            }
        }
        const getNames = async (docs) => {
            const returnDocs = [];
            for (let i = 0; i < docs.length; i++) {
                const tierDoc = await db.Tier.findById(docs[i].tierID);
                const newDoc = {
                    _id: docs[i]._id,
                    tierID: docs[i].tierID,
                    yearID: docs[i].yearID,
                    name: tierDoc.name
                }
                returnDocs.push(newDoc);
            }
            return returnDocs;
        }
        getTiers(yearID, organizationID).then(data => {
            res.status(200).json(data);
        }).catch(er => {
            res.status(500).json(er)
        });
    },
    add: (req, res) => {
        db.CompetitionTier.create({tierID: req.body.tier_id, yearID: req.body.year_id}).then(r => {
            res.status(200).json({message: "success", r: r})
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        db.CompetitionTier.findById(req.body.id).then(competitionTier => {
            db.Score.deleteMany({competitionTierID: competitionTier._id}).then(x => {
                db.Competitor.deleteMany({competitionTierID: competitionTier._id}).then(xx => {
                    db.CompetitionEvent.deleteMany({competitionTierID: competitionTier._id}).then(xxx => {
                        /* delete competitionTier */
                        db.CompetitionTier.deleteOne({_id: competitionTier._id}).then(r => {
                            res.status(200).json({message: "success", r: r, x: x, xx: xx, xxx: xxx});
                        });
                    });
                });
            });
        });
    },
    update: (req, res) => {
        db.CompetitionTier.findById(req.body.id).then(doc => {
            doc.tierID = req.body.tierID;
            doc.yearID = req.body.yearID;
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            })
        })
    }
};