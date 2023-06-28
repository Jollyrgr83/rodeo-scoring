const db = require("../models");

module.exports = {
    getAll: (req, res) => {
        db.Organization.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    getOrganizationsByYearId: (req, res) => {
        const yearID = req.params.year_id;
        const getOrganizations = async (yearID) => {
            const organizations = [];
            const organizationsLibrary = {};
            const competitors = await db.Competitor.find({yearID: yearID});
            for (let i = 0; i < competitors.length; i++) {
                if (!organizationsLibrary[competitors[i].organizationID]) {
                    organizationsLibrary[competitors[i].organizationID] = true;
                    const organizationDoc = await db.Organization.findById(competitors[i].organizationID);
                    organizations.push(organizationDoc);
                }
            }
            if (organizations.length === 0) {
                organizations.push({empty: true});
            } else {
                organizations.unshift({_id: "all", name: "All Organizations"});
            }
            return organizations;
        }
        getOrganizations(yearID).then(data => {
            res.status(200).json(data);
        }).catch(er => res.status(500).json(er));
    },
    add: (req, res) => {
        db.Organization.create({name: req.body.value, coopBoolean: req.body.select}).then(r => {
            res.status(200).json({message: "success", r: r})
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        db.Organization.findById(req.body.id).then(organization => {
            db.Score.deleteMany({organizationID: organization._id}).then(x => {
                db.Competitor.deleteMany({organizationID: organization._id}).then(xx => {
                    /* delete organization */
                    db.Organization.deleteOne({_id: organization._id}).then(r => {
                        res.status(200).json({message: "success", r: r, x: x, xx: xx});
                    });
                });
            });
        });
    },
    update: (req, res) => {
        db.Organization.findById(req.body.id).then(doc => {
            doc.name = req.body.value;
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            })
        })
    }
};