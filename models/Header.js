const mongoose = require('mongoose');
const { Schema } = mongoose;

const headerSchema = new Schema({
  title: {
    type: Array,
    default: ['Wildan', 'Website Developer']
  },
  subtitle: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Header', headerSchema);