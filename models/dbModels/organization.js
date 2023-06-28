const mongoose = require("mongoose");
const { Schema } = mongoose;

const organizationSchema = new Schema({
  name: { type: String, required: true },
  coopBoolean: { type: Boolean, required: true },
  modifiedDate: { type: Date, default: Date.now }
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
