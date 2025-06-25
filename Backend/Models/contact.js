const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { string, required } = require("joi");

const contactSchema = new mongoose.Schema({
  firstname: { type: String,
     required: true },
  lastname: { type: String,
     required: true },
  email: { type: String,
     required: true },
  subject: { type: String,
     required: true },
  message: { type: String,
     required: true },
});

module.exports = mongoose.model("Contact", contactSchema);

