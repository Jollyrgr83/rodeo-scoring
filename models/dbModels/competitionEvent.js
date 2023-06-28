const mongoose = require("mongoose");
const { Schema } = mongoose;

const competitionEventSchema = new Schema({
    yearID: { type: Schema.Types.ObjectId, ref: "Year" },
    competitionTierID: { type: Schema.Types.ObjectId, ref: "CompetitionTier" },
    eventID: { type: Schema.Types.ObjectId, ref: "Event" }
});

const CompetitionEvent = mongoose.model("CompetitionEvent", competitionEventSchema);

module.exports = CompetitionEvent;