const mongoose = require('mongoose');
const { Schema } = mongoose;

const aboutMeSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AboutMe', aboutMeSchema);