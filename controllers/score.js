const db = require("../models");
const fs = require("fs");
const PdfPrinter = require("pdfmake");

module.exports = {
    getAll: (req, res) => {
        db.Score.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    getScoreByCompetitor: (req, res) => {
        const getNamedEventScoresByCompetitor = async (competitorID) => {
            const scoreDocs = await db.Score.find({competitorID: competitorID});
            const data = [];
            if (scoreDocs.length > 0) {
                for (let i = 0; i < scoreDocs.length; i++) {
                    const newScore = {
                        _id: scoreDocs[i]._id,
                        yearID: scoreDocs[i].yearID,
                        eventID: scoreDocs[i].eventID,
                        competitorID: scoreDocs[i].competitorID,
                        competitionTierID: scoreDocs[i].competitionTierID,
                        competitionEventID: scoreDocs[i].competitionEventID,
                        organizationID: scoreDocs[i].organizationID,
                    };
                    if (scoreDocs[i].score) {
                        newScore.score = scoreDocs[i].score;
                    }
                    if (scoreDocs[i].timeMinutes) {
                        newScore.timeMinutes = scoreDocs[i].timeMinutes;
                    }
                    if (scoreDocs[i].timeSeconds) {
                        newScore.timeSeconds = scoreDocs[i].timeSeconds;
                    }
                    const eventDoc = await db.Event.findById(scoreDocs[i].eventID);
                    newScore.eventName = eventDoc.name;
                    data.push(newScore);
                }
            }
            return data;
        }
        getNamedEventScoresByCompetitor(req.params.competitor_id).then(data => {
            res.status(200).json(data);
        }).catch(er => res.status(422).json(er));
    },
    getReport: (req, res) => {
        const compare = (a, b) => {
            if (a.score < b.score) {
                return -1;
            } else if (a.score < b.score) {
                return 1;
            } else if (a.score === b.score) {
                if (a.totalSeconds < b.totalSeconds) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        const buildEventLibrary = async (competitionEvent) => {
            const eventDoc = await db.Event.findById(competitionEvent.eventID);
            const eventLibrary = {_id: competitionEvent._id, name: eventDoc.name, index: {}, rank: [], invalid: []};
            const competitors = await db.Competitor.find({competitionTierID: competitionEvent.competitionTierID});
            for (let i = 0; i < competitors.length; i++) {
                const comp = {
                    competitorID: competitors[i]._id,
                    competitorNumber: competitors[i].competitorNumber,
                    organizationID: competitors[i].organizationID,
                };
                if (competitors[i].firstName) {
                    comp.firstName = competitors[i].firstName;
                    comp.lastName = competitors[i].lastName;
                } else {
                    comp.teamName = competitors[i].teamName;
                    comp.groupNames = competitors[i].groupNames;
                }
                const organizationDoc = await db.Organization.findById(competitors[i].organizationID);
                comp.organizationName = organizationDoc.name;
                const score = await db.Score.findOne({competitorID: competitors[i]._id, competitionEventID: competitionEvent._id});

                /* check if score is entered */
                comp.isScoreValid = (score.score !== "" && score.score !== undefined && score.score !== null && score.score !== "0");

                /* check if time is entered */
                comp.isTimeMinutesValid = (score.timeMinutes !== "" && score.timeMinutes !== undefined && score.timeMinutes !== null && score.timeMinutes !== "0");
                comp.isTimeSecondsValid = (score.timeSeconds !== "" && score.timeSeconds !== undefined && score.timeSeconds !== null && score.timeSeconds !== "0");

                /* if score check or time check is invalid, flag competitor for this event */
                comp.isValid = comp.isScoreValid && (comp.isTimeMinutesValid || comp.isTimeSecondsValid);

                /* set score values */
                comp.score = comp.isScoreValid ? parseInt(score.score) : 0;
                comp.timeMinutes = comp.isTimeMinutesValid ? parseInt(score.timeMinutes) : 0;
                comp.timeSeconds = comp.isTimeSecondsValid ? parseInt(score.timeSeconds) : 0;
                comp.totalSeconds = comp.timeSeconds + (comp.timeMinutes * 60);
                comp.displayTime = comp.timeMinutes + ":" + comp.timeSeconds;

                comp.invalidEvents = [];
                if (comp.isValid) {
                    eventLibrary.rank.push(comp);
                } else {
                    comp.invalidEvents.push(eventLibrary.name);
                    eventLibrary.invalid.push(comp);
                }
                eventLibrary.index[comp.competitorID] = {...comp};
            }
            eventLibrary.rank.sort(compare).reverse();
            for (let i = 0; i < eventLibrary.rank.length; i++) {
                eventLibrary.rank[i].place = i + 1;
                eventLibrary.index[eventLibrary.rank[i].competitorID].place = i + 1;
            }
            for (let i = 0; i < eventLibrary.invalid.length; i++) {
                eventLibrary.invalid[i].place = "invalid";
                eventLibrary.index[eventLibrary.invalid[i].competitorID].place = "invalid";
            }
            return eventLibrary;
        }
        const calculateOverall = async (competitionTierID, eventLibraries) => {
            const overallEventLibrary = {_id: "overall", name: "Overall", index: {}, rank: [], invalid: []};
            const competitors = await db.Competitor.find({competitionTierID: competitionTierID});
            for (let i = 0; i < competitors.length; i++) {
                const comp = {
                    competitorID: competitors[i]._id,
                    competitorNumber: competitors[i].competitorNumber,
                    organizationID: competitors[i].organizationID,
                };
                if (competitors[i].firstName) {
                    comp.firstName = competitors[i].firstName;
                    comp.lastName = competitors[i].lastName;
                } else {
                    comp.teamName = competitors[i].teamName;
                    comp.groupNames = competitors[i].groupNames;
                }
                const organizationDoc = await db.Organization.findById(competitors[i].organizationID);
                comp.organizationName = organizationDoc.name;

                comp.score = 0;
                comp.totalSeconds = 0;

                comp.invalidEvents = [];

                let invalidToggle = false;
                for (let j = 0; j < eventLibraries.length; j++) {
                    if (eventLibraries[j].index[competitors[i]._id].place === "invalid") {
                        invalidToggle = true;
                        comp.invalidEvents.push(eventLibraries[j].name);
                    } else {
                        comp.score = comp.score + eventLibraries[j].index[competitors[i]._id].score;
                        comp.totalSeconds = comp.totalSeconds + eventLibraries[j].index[competitors[i]._id].totalSeconds;
                    }
                }
                if (invalidToggle) {
                    comp.place = "invalid";
                    overallEventLibrary.invalid.push(comp);
                } else {
                    comp.timeMinutes = Math.floor(comp.totalSeconds / 60);
                    comp.timeSeconds = comp.totalSeconds - (comp.timeMinutes * 60);
                    comp.displayTime = comp.timeMinutes.toString() + ":" + comp.timeSeconds.toString();
                    overallEventLibrary.rank.push(comp);
                }
                overallEventLibrary.index[comp.competitorID] = {...comp};
            }
            overallEventLibrary.rank.sort(compare).reverse();
            for (let i = 0; i < overallEventLibrary.rank.length; i++) {
                overallEventLibrary.rank[i].place = i + 1;
                overallEventLibrary.index[overallEventLibrary.rank[i].competitorID].place = i + 1;
            }
            return overallEventLibrary;
        }
        const getScoreData = async (yearID) => {
            const yearValues = {};
            const competitionTiers = await db.CompetitionTier.find({yearID: yearID});
            for (let i = 0; i < competitionTiers.length; i++) {
                const tierDoc = await db.Tier.findById(competitionTiers[i].tierID);
                const tierName = tierDoc.name;
                yearValues[competitionTiers[i]._id] = {
                    _id: competitionTiers[i]._id,
                    name: tierName,
                    events: [],
                    eventLibraries: [],
                    index: {}
                };
                const competitionEvents = await db.CompetitionEvent.find({competitionTierID: competitionTiers[i]._id});
                for (let j = 0; j < competitionEvents.length; j++) {
                    const eventLibrary = await buildEventLibrary(competitionEvents[j]);
                    yearValues[competitionTiers[i]._id].events.push(eventLibrary._id);
                    yearValues[competitionTiers[i]._id].index[eventLibrary._id] = {...eventLibrary};
                    yearValues[competitionTiers[i]._id].eventLibraries.push(eventLibrary);
                }
                const overallEventLibrary = await calculateOverall(competitionTiers[i]._id, yearValues[competitionTiers[i]._id].eventLibraries);
                yearValues[competitionTiers[i]._id].index[overallEventLibrary._id] = {...overallEventLibrary};
                yearValues[competitionTiers[i]._id].events.push(overallEventLibrary._id);
                yearValues[competitionTiers[i]._id].eventLibraries.push(overallEventLibrary);
            }
            return yearValues;
        }
        const filterResults = async (values) => {
            const yearData = await getScoreData(values.yearID);
            const tierData = yearData[values.competitionTierID];
            const eventData = tierData.index[values.eventID];

            const wrapper = {
                values: values,
                yearData: yearData,
                tierData: tierData,
                eventData: eventData,
                eventName: eventData.name,
                tierName: tierData.name
            };

            if (values.organizationID === "all") {
                if (values.reportType === "awards") {
                    if (eventData.rank.length > 3) {
                        // return [eventData.rank[0], eventData.rank[1], eventData.rank[2]];
                        wrapper.filteredData = [eventData.rank[0], eventData.rank[1], eventData.rank[2]];
                        wrapper.invalid = eventData.invalid;
                    } else {
                        // return eventData.rank;
                        wrapper.filteredData = eventData.rank;
                        wrapper.invalid = eventData.invalid;
                    }
                } else {
                    // return eventData.rank;
                    wrapper.filteredData = eventData.rank;
                    wrapper.invalid = eventData.invalid;
                }
            } else {
                const filteredRank = eventData.rank.filter(comp => {
                    return comp.organizationID.toString() === values.organizationID.toString();
                });
                const filteredInvalid = eventData.invalid.filter(comp => {
                    return comp.organizationID.toString() === values.organizationID.toString();
                })
                if (values.reportType === "awards") {
                    if (filteredRank.length > 3) {
                        // return [filteredRank[0], filteredRank[1], filteredRank[2]];
                        wrapper.filteredData = [filteredRank[0], filteredRank[1], filteredRank[2]];
                    } else {
                        // return filteredRank;
                        wrapper.filteredData = filteredRank;
                    }
                } else {
                    // return filteredRank;
                    wrapper.filteredData = filteredRank;
                }
                wrapper.invalid = filteredInvalid;
            }
            const pdfContent = await generatePdf(tierData.name, eventData.name, wrapper.filteredData);
            // await createPdf(pdfContent);
            wrapper.pdfContent = pdfContent;

            wrapper.csvData = await generateCsv(tierData.name, eventData.name, wrapper.filteredData);

            return wrapper;
        }
        const generatePdf = async (tierName, eventName, filteredData) => {
            const content = [
                { text: "", fontSize: 22 },
                { table: { headerRows: 1, widths: [ "15%", "40%", "15%", "15%", "15%" ], body: [ [ "Competitor Number", "Organization", "Place", "Score", "Time" ] ] } }
            ];
            content[0].text = `${tierName} - ${eventName}`;
            for (let i = 0; i < filteredData.length; i++) {
                const competitorNumber = filteredData[i].competitorNumber;
                const organizationName = filteredData[i].organizationName;
                const place = filteredData[i].place;
                const score = filteredData[i].score;
                const displayTime = filteredData[i].displayTime
                // const tt = parseFloat(this.data.tiers[tier_id][event_id][i].total_seconds);
                // const tmin = (Math.floor(tt / 60)).toFixed(0);
                // const tsec = (Math.floor(tt % 60)).toFixed(0);
                // const trem = ((tt % 60) - tsec).toFixed(2);
                // const tminDisp = tmin.length === 2 ? tmin : `0${tmin}`;
                // const tsecDisp = tsec.length === 2 ? tsec : `0${tsec}`;
                // const tremDisp = `${trem[2]}${trem[3]}`
                // const ttime = `${tminDisp}:${tsecDisp}.${tremDisp}`;

                const tArr = [competitorNumber, organizationName, place, score, displayTime];
                content[1].table.body.push(tArr);
            }
            return content;
        }
        const createPdf = async (content) => {
            const fonts = {
                Roboto: {
                    normal: "./public/assets/fonts/Lato-Light.ttf",
                    bold: "./public/assets/fonts/Lato-Bold.ttf",
                    italics: "./public/assets/fonts/Lato-Italic.ttf",
                    bolditalics: "./public/assets/fonts/Lato-BoldItalic.ttf"
                }
            }
            const printer = new PdfPrinter(fonts);
            const docDefinition = {content: content};
            const options = {};
            const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
            await pdfDoc.pipe(fs.createWriteStream("./output/report.pdf"));
            await pdfDoc.end();
        }
        const generateCsv = async (tierName, eventName, filteredData) => {
            let csv = `${tierName} - ${eventName}`;
            csv += " \n";
            csv += "Competitor Number, Organization, Place, Score, Time";
            csv += " \n";
            for (let i = 0; i < filteredData.length; i++) {
                const competitorNumber = filteredData[i].competitorNumber;
                const organizationName = filteredData[i].organizationName;
                const place = filteredData[i].place;
                const score = filteredData[i].score;
                const displayTime = filteredData[i].displayTime
                csv += competitorNumber + ", " + organizationName + ", " + place + ", " + score + ", " + displayTime;
                csv += " \n";
            }
            return csv;
        }
        const values = {
            yearID: req.params.year_id,
            reportType: req.params.report_type, /* "awards" or "all" */
            organizationID: req.params.organization_id,
            competitionTierID: req.params.competition_tier_id,
            eventID: req.params.event_id
        };
        filterResults(values).then(data => {
            res.status(200).json(data);
        });
    },
    add: (req, res) => {
        const newScore = {
            yearID: req.body.yearID,
            eventID: req.body.eventID,
            competitorID: req.body.competitorID,
            competitionTierID: req.body.competitionTierID,
            competitionEventID: req.body.competitionEventID,
            organizationID: req.body.organizationID,
        };
        db.Score.create(newScore).then(r => {
            res.status(200).json({message: "success", r: r})
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        db.Score.findById(req.body.id).then(doc => {
            db.Score.deleteOne({_id: doc._id}).then(r => {
                res.status(200).json({message: "success", r: r});
            });
        });
    },
    update: (req, res) => {
        db.Score.findById(req.body.id).then(doc => {
            doc.score = req.body.score;
            doc.timeMinutes = req.body.timeMinutes;
            doc.timeSeconds = req.body.timeSeconds;
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            });
        });
    },
    reconcile: (req, res) => {
        const reconcile = async (competitorID) => {
            const data = {};
            const competitor = await db.Competitor.findById(competitorID);
            const competitionEvents = await db.CompetitionEvent.find({competitionTierID: competitor.competitionTierID});
            const scores = await db.Score.find({competitorID: competitorID});
            data.numberOfCompetitionEvents = competitionEvents.length;
            data.numberOfScores = scores.length;
            if (data.numberOfCompetitionEvents === data.numberOfScores) {
                data.status = true;
            }
            if (data.numberOfCompetitionEvents > data.numberOfScores) {
                data.scores = [];
                for (let i = 0; i < competitionEvents.length; i++) {
                    const score = await db.Score.find({competitorID: competitorID, competitionEventID: competitionEvents[i]._id});
                    if (score.length === 0) {
                        /* create score */
                        const newScore = {
                            yearID: competitor.yearID,
                            eventID: competitionEvents[i].eventID,
                            competitorID: competitorID,
                            competitionTierID: competitor.competitionTierID,
                            competitionEventID: competitionEvents[i]._id,
                            organizationID: competitor.organizationID
                        };
                        const newScoreDoc = await db.Score.create(newScore);
                        data.scores.push([newScoreDoc]);
                    } else {
                        data.scores.push(score);
                    }
                }
            }
            return data
        }
        reconcile(req.params.competitor_id).then(data => {
            res.status(200).json(data);
        });
    }
};
