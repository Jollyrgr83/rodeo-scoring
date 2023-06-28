const mongoose = require("mongoose");
const { Schema } = mongoose;

const competitorSchema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  teamName: { type: String, required: false },
  groupNames: { type: String, required: false },
  organizationID: { type: Schema.Types.ObjectId, ref: "Organization" },
  competitionTierID: { type: Schema.Types.ObjectId, ref: "CompetitionTier" },
  yearID: { type: Schema.Types.ObjectId, ref: "Year" },
  competitorNumber: { type: String, required: true },
  modifiedDate: { type: Date, default: Date.now }
});

const Competitor = mongoose.model("Competitor", competitorSchema);

module.exports = Competitor;
