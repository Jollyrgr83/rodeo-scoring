const mongoose = require("mongoose");
// define schema
const { Schema } = mongoose;
// create event schema
const eventSchema = new Schema({
  name: { type: String, required: true },
  modifiedDate: { type: Date, default: Date.now }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
