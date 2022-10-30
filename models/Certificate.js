const mongoose = require('mongoose');
const { Schema } = mongoose;

const certificateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  credentialUrl: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);