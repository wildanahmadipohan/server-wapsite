const mongoose = require('mongoose');
const { Schema } = mongoose;

const abilitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Ability', abilitySchema);