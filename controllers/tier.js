const db = require("../models");

module.exports = {
    getAll: (req, res) => {
        db.Tier.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    add: (req, res) => {
        db.Tier.create({name: req.body.value, teamBoolean: req.body.select}).then(r => {
            res.status(200).json({message: "success", r: r})
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        const deleteHelper = async (tier) => {
            /* get all competitionTiers with matching tierID */
            const competitionTiers = await db.CompetitionTier.find({tierID: tier._id});
            for (let i = 0; i < competitionTiers.length; i++) {
                await db.Score.deleteMany({competitionTierID: competitionTiers[i]._id})
                await db.CompetitionEvent.deleteMany({competitionTierID: competitionTiers[i]._id});
                await db.Competitor.deleteMany({competitionTierID: competitionTiers[i]._id});
                await db.CompetitionTier.deleteOne({_id: competitionTiers[i]._id});
            }
        }
        db.Tier.findById(req.body.id).then(tier => {
            deleteHelper(tier).then(() => {
                db.Tier.deleteOne({_id: tier._id}).then(r => {
                    res.status(200).json({message: "success", r: r});
                });
            });
        });
    },
    update: (req, res) => {
        db.Tier.findById(req.body.id).then(doc => {
            doc.name = req.body.value;
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            })
        })
    }
};