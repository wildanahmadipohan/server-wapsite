const mongoose = require('mongoose');
const { Schema } = mongoose;

const stackSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Stack', stackSchema);