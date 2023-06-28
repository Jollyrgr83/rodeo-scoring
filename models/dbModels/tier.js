const mongoose = require("mongoose");
const { Schema } = mongoose;

const tierSchema = new Schema({
    name: { type: String, required: true },
    teamBoolean: { type: Boolean, required: true },
    modifiedDate: { type: Date, default: Date.now }
});

const Tier = mongoose.model("Tier", tierSchema);

module.exports = Tier;