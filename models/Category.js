const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  projectId: [{
    type: mongoose.ObjectId,
    ref: 'Project'
  }]
});

module.exports = mongoose.model('Category', categorySchema);