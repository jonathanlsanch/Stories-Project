'use strict';

const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({  
  title: {
    type: String,
    required: [true, 'The story title is required']
  },
  content: {
    type: String,
    required: [true, 'The story name is required']
  }
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;