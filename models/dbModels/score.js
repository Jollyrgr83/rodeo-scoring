const mongoose = require("mongoose");
const { Schema } = mongoose;

const scoreSchema = new Schema({
  yearID: { type: Schema.Types.ObjectId, ref: "Year" },
  eventID: { type: Schema.Types.ObjectId, ref: "Event" },
  competitorID: { type: Schema.Types.ObjectId, ref: "Competitor" },
  competitionTierID: { type: Schema.Types.ObjectId, ref: "CompetitionTier"},
  competitionEventID: { type: Schema.Types.ObjectId, ref: "CompetitionEvent" },
  organizationID: { type: Schema.Types.ObjectId, ref: "Organization" },
  score: { type: String, required: false },
  timeMinutes: { type: String, required: false },
  timeSeconds: { type: String, required: false },
  modifiedDate: { type: Date, default: Date.now }
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
