const mongoose = require("mongoose");
const { Schema } = mongoose;

const yearSchema = new Schema({
  name: { type: Number, required: false },
  modifiedDate: { type: Date, default: Date.now }
});

const Year = mongoose.model("Year", yearSchema);

module.exports = Year;
