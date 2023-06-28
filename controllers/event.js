const db = require("../models");

module.exports = {
    getAll: (req, res) => {
        db.Event.find({}).then(data => {
            res.status(200).json(data)
        }).catch(er => res.status(422).json(er));
    },
    add: (req, res) => {
        db.Event.create({name: req.body.value}).then(r => {
            res.status(200).json({message: "success", r: r})
        }).catch(er => res.status(500).json(er));
    },
    delete: (req, res) => {
        db.Event.findById(req.body.id).then(event => {
            db.Score.deleteMany({eventID: event._id}).then(x => {
                db.CompetitionEvent.deleteMany({eventID: event._id}).then(xx => {
                   /* delete event */
                    db.Event.deleteOne({_id: event._id}).then(r => {
                        res.status(200).json({message: "success", r: r, x: x, xx: xx});
                    });
                });
            });
        });
    },
    update: (req, res) => {
        db.Event.findById(req.body.id).then(doc => {
            doc.name = req.body.value;
            doc.save().then(r => {
                res.status(200).json({message: "success", r: r});
            })
        })
    }
};