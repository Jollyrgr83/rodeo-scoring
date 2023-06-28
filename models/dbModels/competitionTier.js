const mongoose = require("mongoose");
const { Schema } = mongoose;

const competitionTierSchema = new Schema({
    tierID: { type: Schema.Types.ObjectId, ref: "Tier" },
    yearID: { type: Schema.Types.ObjectId, ref: "Year" }
});

const CompetitionTier = mongoose.model("CompetitionTier", competitionTierSchema);

module.exports = CompetitionTier;