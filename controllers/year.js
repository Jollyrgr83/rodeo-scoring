const db = require("../models");

module.exports = {
    getAll: (req, res) => {
        db.Year.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    add: (req, res) => {
        db.Year.create({name: req.body.value}).then(r => {
            res.status(200).json({message: "success", r: r})
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        db.Year.findById(req.body.id).then(year => {
            db.Score.deleteMany({yearID: year._id}).then(x => {
                db.Competitor.deleteMany({yearID: year._id}).then(xx => {
                    db.CompetitionEvent.deleteMany({yearID: year._id}).then(xxx => {
                        db.CompetitionTier.deleteMany({yearID: year._id}).then(xxxx => {
                            /* delete year */
                            db.Year.deleteOne({_id: year._id}).then(r => {
                                res.status(200).json({message: "success", r: r, x: x, xx: xx, xxx: xxx, xxxx: xxxx});
                            });
                        });
                    });
                });
            });
        });
    },
    update: (req, res) => {
        db.Year.findById(req.body.id).then(doc => {
            doc.name = req.body.value;
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            })
        })
    }
};