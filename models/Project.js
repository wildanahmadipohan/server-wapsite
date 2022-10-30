const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.ObjectId,
    ref: 'Category'
  },
  imageId: [{
    type: mongoose.ObjectId,
    ref: 'Image'
  }],
  stackId: [{
    type: mongoose.ObjectId,
    ref: 'Stack'
  }],
  tag: [String]
});

module.exports = mongoose.model('Project', projectSchema);